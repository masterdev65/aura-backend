import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateServiceDto, UpdateServiceDto, CreateCategoryDto, UpdateCategoryDto } from '../../common/dto';
import { IService, ICategory } from '../../common/interfaces';

@Injectable()
export class ServicesService {
  constructor(private databaseService: DatabaseService) {}

  async findAllServices(): Promise<IService[]> {
    return this.databaseService.findAll<IService>('services', [
      { field: 'isActive', operator: '==', value: true },
    ]);
  }

  async findServiceById(id: string): Promise<IService> {
    const service = await this.databaseService.findById<IService>('services', id);
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async createService(createServiceDto: CreateServiceDto): Promise<IService> {
    const serviceData: Partial<IService> = {
      ...createServiceDto,
      isActive: true,
      order: createServiceDto.order || 999,
    };

    const { id, data } = await this.databaseService.create('services', serviceData);
    return { id, ...data } as IService;
  }

  async updateService(id: string, updateServiceDto: UpdateServiceDto): Promise<void> {
    await this.findServiceById(id);
    await this.databaseService.update('services', id, updateServiceDto);
  }

  async deleteService(id: string): Promise<void> {
    await this.findServiceById(id);
    await this.databaseService.update('services', id, { isActive: false });
  }

  async findAllCategories(): Promise<ICategory[]> {
    return this.databaseService.findAll<ICategory>('categories', [
      { field: 'isActive', operator: '==', value: true },
    ]);
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    const categoryData: Partial<ICategory> = {
      ...createCategoryDto,
      isActive: true,
      order: createCategoryDto.order || 999,
    };

    const { id, data } = await this.databaseService.create('categories', categoryData);
    return { id, ...data } as ICategory;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<void> {
    await this.databaseService.update('categories', id, updateCategoryDto);
  }
}
