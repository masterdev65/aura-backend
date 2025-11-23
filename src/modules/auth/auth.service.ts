import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { FirebaseConfigService } from '../../config/firebase.config';
import { RegisterDto, LoginDto, UpdateProfileDto } from '../../common/dto';
import { IUser, UserRole, UserStatus, AuthMethod } from '../../common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private firebaseConfig: FirebaseConfigService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.databaseService.findOne<IUser>(
      'users',
      'email',
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const userRecord = await this.firebaseConfig.getAuth().createUser({
      email: registerDto.email,
      password: registerDto.password,
      displayName: `${registerDto.firstName} ${registerDto.lastName}`,
      phoneNumber: registerDto.phone,
    });

    const userData: Partial<IUser> = {
      uid: userRecord.uid,
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phone: registerDto.phone,
      role: registerDto.role || UserRole.CLIENT,
      status: UserStatus.ACTIVE,
      authMethod: [AuthMethod.EMAIL],
      notificationPreferences: {
        email: true,
        sms: true,
        whatsapp: false,
      },
    };

    if (userData.role === UserRole.CLIENT) {
      userData.loyaltyPoints = 0;
      userData.noShowCount = 0;
      userData.totalSpent = 0;
    }

    await this.databaseService.create('users', userData, userRecord.uid);

    // userData.role is guaranteed to be defined here due to the default value on line 42
    const token = this.generateToken(userRecord.uid, userData.role!);

    return {
      user: userData,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.databaseService.findOne<IUser>(
      'users',
      'email',
      loginDto.email,
    );

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Invalid credentials');
    }

    try {
      await this.firebaseConfig.getAuth().getUserByEmail(loginDto.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.databaseService.update('users', user.uid, {
      lastLogin: new Date(),
    });

    const token = this.generateToken(user.uid, user.role);

    return {
      user,
      token,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.databaseService.findById<IUser>('users', userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const updateData: any = {};

    if (updateProfileDto.firstName) updateData.firstName = updateProfileDto.firstName;
    if (updateProfileDto.lastName) updateData.lastName = updateProfileDto.lastName;
    if (updateProfileDto.phone) updateData.phone = updateProfileDto.phone;
    if (updateProfileDto.profilePhoto) updateData.profilePhoto = updateProfileDto.profilePhoto;

    if (updateProfileDto.notificationEmail !== undefined ||
        updateProfileDto.notificationSMS !== undefined ||
        updateProfileDto.notificationWhatsApp !== undefined) {
      updateData.notificationPreferences = {
        email: updateProfileDto.notificationEmail ?? user.notificationPreferences.email,
        sms: updateProfileDto.notificationSMS ?? user.notificationPreferences.sms,
        whatsapp: updateProfileDto.notificationWhatsApp ?? user.notificationPreferences.whatsapp,
      };
    }

    await this.databaseService.update('users', userId, updateData);

    return this.databaseService.findById<IUser>('users', userId);
  }

  async validateUser(userId: string): Promise<IUser> {
    const user = await this.databaseService.findById<IUser>('users', userId);
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }

  private generateToken(userId: string, role: UserRole): string {
    const payload = { sub: userId, role };
    return this.jwtService.sign(payload);
  }
}
