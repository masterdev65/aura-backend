import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto, CheckInDto } from '../../common/dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { IUser } from '../../common/interfaces';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  // Public endpoint for checking availability (no auth needed for booking flow)
  @Get('availability')
  checkAvailability(
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
  ) {
    return this.appointmentsService.checkAvailability(date, serviceId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: IUser) {
    return this.appointmentsService.findUserAppointments(user.uid, user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findAppointmentById(id);
  }

  @Post()
  create(@Body() createDto: CreateAppointmentDto) {
    // Allow appointment creation without auth for public booking
    return this.appointmentsService.createAppointment(null, createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointment(id, user.uid, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @CurrentUser() user: IUser) {
    return this.appointmentsService.cancelAppointment(id, user.uid);
  }

  @Post('check-in')
  checkIn(@Body() checkInDto: CheckInDto) {
    if (!checkInDto.appointmentId) {
      throw new Error('Appointment ID is required for check-in');
    }
    return this.appointmentsService.checkIn(
      checkInDto.appointmentId as string,
      checkInDto.qrCode,
      checkInDto.pinCode,
    );
  }
}
