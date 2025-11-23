import { IsEmail, IsString, IsEnum, IsOptional, MinLength, IsPhoneNumber, IsBoolean } from 'class-validator';
import { UserRole, AuthMethod } from '../interfaces';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsPhoneNumber('US')
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginWithSMSDto {
  @IsPhoneNumber('US')
  phone: string;
}

export class VerifySMSDto {
  @IsPhoneNumber('US')
  phone: string;

  @IsString()
  code: string;
}

export class SocialAuthDto {
  @IsString()
  idToken: string;

  @IsEnum(AuthMethod)
  provider: AuthMethod;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsPhoneNumber('US')
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  profilePhoto?: string;

  @IsBoolean()
  @IsOptional()
  notificationEmail?: boolean;

  @IsBoolean()
  @IsOptional()
  notificationSMS?: boolean;

  @IsBoolean()
  @IsOptional()
  notificationWhatsApp?: boolean;
}
