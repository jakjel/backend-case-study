import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { ApplicationService } from './data.application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../model/customer';
import { Subscription } from 'rxjs';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Subscription])],
  providers: [DataService, ApplicationService], 
  exports: [DataService, ApplicationService],
})
export class DataModule {}
