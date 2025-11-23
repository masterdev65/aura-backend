import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { ServicesService } from '../services/services.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../../common/dto';
import { IAppointment, AppointmentStatus, PaymentStatus, CreatedBy, IUser, AdditionalService } from '../../common/interfaces';
import * as QRCode from 'qrcode';

@Injectable()
export class AppointmentsService {
  constructor(
    private databaseService: DatabaseService,
    private servicesService: ServicesService,
    private configService: ConfigService,
  ) {}

  async createAppointment(clientId: string, createDto: CreateAppointmentDto): Promise<IAppointment> {
    const service = await this.servicesService.findServiceById(createDto.serviceId);

    let totalDuration = service.duration;
    let totalPrice = service.price;
    const additionalServices: AdditionalService[] = [];

    if (createDto.additionalServices?.length) {
      for (const addService of createDto.additionalServices) {
        const additional = await this.databaseService.findById<any>('services', addService.serviceId);
        if (additional) {
          totalDuration += (additional.duration as number);
          totalPrice += (additional.price as number);
          additionalServices.push({
            serviceId: addService.serviceId,
            name: additional.name as string,
            price: additional.price as number,
            duration: additional.duration as number,
          });
        }
      }
    }

    const endTime = new Date(createDto.startTime.getTime() + totalDuration * 60000);

    const depositAmount = this.configService.get<number>('stripe.depositAmount') || 20;

    const qrData = `${clientId}-${Date.now()}`;
    const qrCode = await QRCode.toDataURL(qrData);
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString();

    const freeCancellationDeadline = new Date(
      createDto.startTime.getTime() -
      (this.configService.get<number>('cancellationPolicy.freeCancellationHours') || 24) * 3600000
    );

    const appointmentData: Partial<IAppointment> = {
      clientId,
      employeeId: createDto.employeeId || await this.autoAssignEmployee(createDto.serviceId, createDto.startTime),
      serviceId: createDto.serviceId,
      additionalServices,
      date: createDto.date,
      startTime: createDto.startTime,
      endTime,
      duration: totalDuration,
      status: AppointmentStatus.PENDING,
      totalPrice,
      depositPaid: 0,
      remainingBalance: totalPrice,
      paymentStatus: PaymentStatus.DEPOSIT_PAID,
      specialRequests: createDto.specialRequests,
      cancellationPolicy: {
        deadline: freeCancellationDeadline,
        fee: 0,
      },
      qrCode,
      pinCode,
      createdBy: CreatedBy.CLIENT,
      remindersSent: {
        email24h: false,
        sms24h: false,
        email2h: false,
        sms2h: false,
      },
    };

    const { id, data } = await this.databaseService.create('appointments', appointmentData);
    return { id, ...data } as IAppointment;
  }

  async findAppointmentById(id: string): Promise<IAppointment> {
    const appointment = await this.databaseService.findById<IAppointment>('appointments', id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async findUserAppointments(userId: string, role: string): Promise<IAppointment[]> {
    const field = role === 'employee' ? 'employeeId' : 'clientId';
    return this.databaseService.findAll<IAppointment>('appointments', [
      { field, operator: '==', value: userId },
    ]);
  }

  async updateAppointment(id: string, userId: string, updateDto: UpdateAppointmentDto): Promise<void> {
    const appointment = await this.findAppointmentById(id);

    if (appointment.clientId !== userId) {
      throw new BadRequestException('Not authorized to update this appointment');
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot update completed appointment');
    }

    await this.databaseService.update('appointments', id, updateDto);
  }

  async cancelAppointment(id: string, userId: string): Promise<void> {
    const appointment = await this.findAppointmentById(id);

    if (appointment.clientId !== userId) {
      throw new BadRequestException('Not authorized to cancel this appointment');
    }

    const now = new Date();
    const deadline = new Date(appointment.cancellationPolicy.deadline);
    let refundAmount = appointment.depositPaid;

    if (now > deadline) {
      const lateFee = this.configService.get<number>('cancellationPolicy.lateCancellationFee') || 50;
      refundAmount = appointment.depositPaid * (1 - lateFee / 100);
    }

    await this.databaseService.update('appointments', id, {
      status: AppointmentStatus.CANCELLED,
    });

    // TODO: Process refund via Stripe
  }

  async checkIn(appointmentId: string, qrCode?: string, pinCode?: string): Promise<IAppointment> {
    const appointment = await this.findAppointmentById(appointmentId);

    if (qrCode && appointment.qrCode !== qrCode) {
      throw new BadRequestException('Invalid QR code');
    }

    if (pinCode && appointment.pinCode !== pinCode) {
      throw new BadRequestException('Invalid PIN code');
    }

    await this.databaseService.update('appointments', appointmentId, {
      status: AppointmentStatus.CHECKED_IN,
      checkInTime: new Date(),
    });

    return this.findAppointmentById(appointmentId);
  }

  async checkAvailability(dateStr: string, serviceId: string): Promise<{ time: string; available: boolean }[]> {
    // Get the service to know its duration
    const service = await this.servicesService.findServiceById(serviceId);
    const serviceDuration = service.duration;

    // Parse the date
    const targetDate = new Date(dateStr);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const day = targetDate.getDate();

    // Get all appointments for this date
    const startOfDay = new Date(year, month, day, 0, 0, 0);
    const endOfDay = new Date(year, month, day, 23, 59, 59);

    const appointments = await this.databaseService.findAll<IAppointment>('appointments', [
      { field: 'status', operator: 'in', value: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.CHECKED_IN] },
    ]);

    // Filter appointments by date
    const dayAppointments = appointments.filter(apt => {
      const aptDate = apt.startTime instanceof Date ? apt.startTime : new Date(apt.startTime);
      return aptDate >= startOfDay && aptDate <= endOfDay;
    });

    // Generate time slots from 9:00 to 18:00 (every 30 minutes)
    const slots: { time: string; available: boolean }[] = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotStart = new Date(year, month, day, hour, minute);
        const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60000);

        // Check if this slot conflicts with any existing appointment
        let available = true;
        for (const apt of dayAppointments) {
          const aptStart = apt.startTime instanceof Date ? apt.startTime : new Date(apt.startTime);
          const aptEnd = apt.endTime instanceof Date ? apt.endTime : new Date(apt.endTime);

          // Check for overlap: slot overlaps with appointment if:
          // slotStart < aptEnd AND slotEnd > aptStart
          if (slotStart < aptEnd && slotEnd > aptStart) {
            available = false;
            break;
          }
        }

        // Also make sure the slot doesn't go past business hours (18:00)
        if (slotEnd > new Date(year, month, day, 18, 0)) {
          available = false;
        }

        slots.push({ time: timeStr, available });
      }
    }

    return slots;
  }

  private async autoAssignEmployee(serviceId: string, startTime: Date): Promise<string> {
    // TODO: Implement smart assignment based on availability and workload
    const employees = await this.databaseService.findAll<IUser>('users', [
      { field: 'role', operator: '==', value: 'employee' },
      { field: 'status', operator: '==', value: 'active' },
    ]);

    if (!employees.length) {
      throw new BadRequestException('No employees available');
    }

    return employees[0].uid;
  }
}
