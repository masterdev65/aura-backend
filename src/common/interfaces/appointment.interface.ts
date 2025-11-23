export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum PaymentStatus {
  DEPOSIT_PAID = 'deposit_paid',
  PAID_FULL = 'paid_full',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum CreatedBy {
  CLIENT = 'client',
  MANAGER = 'manager',
  WALK_IN = 'walk_in',
}

export interface AdditionalService {
  serviceId: string;
  name: string;
  price: number;
  duration: number;
}

export interface CancellationPolicy {
  deadline: Date;
  fee: number;
}

export interface RemindersSent {
  email24h: boolean;
  sms24h: boolean;
  email2h: boolean;
  sms2h: boolean;
}

export interface IAppointment {
  id: string;
  clientId: string;
  employeeId: string;
  serviceId: string;
  additionalServices?: AdditionalService[];
  date: Date;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  status: AppointmentStatus;
  totalPrice: number;
  depositPaid: number;
  remainingBalance: number;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  specialRequests?: string;
  cancellationPolicy: CancellationPolicy;
  qrCode: string;
  pinCode: string;
  checkInTime?: Date;
  completedTime?: Date;
  createdBy: CreatedBy;
  createdAt: Date;
  updatedAt: Date;
  remindersSent: RemindersSent;
}
