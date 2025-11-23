import { Module } from '@nestjs/common';
import { ServicesController, CategoriesController } from './services.controller';
import { ServicesService } from './services.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ServicesController, CategoriesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
