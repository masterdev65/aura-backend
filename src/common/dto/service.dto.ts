import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  categoryId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(1)
  duration: number; // in minutes

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  duration?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateAdditionalServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  duration: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  compatibleWith?: string[]; // service IDs
}

export class UpdateAdditionalServiceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  duration?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  compatibleWith?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
