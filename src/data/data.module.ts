import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { ApplicationService } from './data.application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../model/customer';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [DataService, ApplicationService], 
  exports: [DataService, ApplicationService],
})
export class DataModule {}
