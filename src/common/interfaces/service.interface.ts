export interface IService {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  photo?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface IAdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  compatibleWith: string[]; // service IDs, empty array means compatible with all
  isActive: boolean;
}
