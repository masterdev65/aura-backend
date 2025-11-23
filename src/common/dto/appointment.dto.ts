import { IsString, IsDate, IsNumber, IsOptional, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '../interfaces';

export class AdditionalServiceDto {
  @IsString()
  serviceId: string;
}

export class CreateAppointmentDto {
  @IsString()
  serviceId: string;

  @IsString()
  @IsOptional()
  employeeId?: string; // Optional for auto-assignment

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalServiceDto)
  @IsOptional()
  additionalServices?: AdditionalServiceDto[];

  @IsString()
  @IsOptional()
  specialRequests?: string;
}

export class UpdateAppointmentDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startTime?: Date;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsArray()
  @ValidateNested({ each: true})
  @Type(() => AdditionalServiceDto)
  @IsOptional()
  additionalServices?: AdditionalServiceDto[];

  @IsString()
  @IsOptional()
  specialRequests?: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}

export class CancelAppointmentDto {
  @IsString()
  reason: string;
}

export class CheckInDto {
  @IsString()
  @IsOptional()
  qrCode?: string;

  @IsString()
  @IsOptional()
  pinCode?: string;

  @IsString()
  @IsOptional()
  appointmentId?: string;
}
