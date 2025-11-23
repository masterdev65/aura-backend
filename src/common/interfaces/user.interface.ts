export enum UserRole {
  CLIENT = 'client',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

export enum AuthMethod {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  SMS = 'sms',
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface IUser {
  uid: string;
  role: UserRole;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  authMethod: AuthMethod[];
  createdAt: Date;
  lastLogin?: Date;
  status: UserStatus;

  // Client specific
  loyaltyPoints?: number;
  preferredEmployeeId?: string;
  noShowCount?: number;
  totalSpent?: number;
  firstVisit?: Date;
  lastVisit?: Date;

  // Employee specific
  hireDate?: Date;
  bio?: string;
  specializations?: string[];
  rating?: number;
  totalClients?: number;
  totalRevenue?: number;

  // Notification preferences
  notificationPreferences: NotificationPreferences;
}
