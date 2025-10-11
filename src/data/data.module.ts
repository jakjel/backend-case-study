import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { ApplicationService } from './data.application.service';

@Module({
  providers: [DataService, ApplicationService], 
  exports: [DataService, ApplicationService],
})
export class DataModule {}
