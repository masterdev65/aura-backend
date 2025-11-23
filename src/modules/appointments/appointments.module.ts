import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { DatabaseModule } from '../../database/database.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [DatabaseModule, ServicesModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
