import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseConfigService } from '../config/firebase.config';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [FirebaseConfigService, DatabaseService],
  exports: [FirebaseConfigService, DatabaseService],
})
export class DatabaseModule {}
