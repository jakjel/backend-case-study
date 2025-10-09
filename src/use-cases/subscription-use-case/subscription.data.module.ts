import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../../model/entities/tenant';
import { Payment } from '../../model/entities/payment';
import { Subscription } from '../../model/entities/subscription';
import { HousingUnit } from '../../model/entities/housing-unit';
import { ResidentialComplex } from '../../model/entities/residential-complex';
import { Device } from '../../model/entities/device';
import { Log } from '../../model/entities/log';
import { Energy } from '../../model/entities/energy';
import { ApplicationService } from '../subscription-use-case/subscription.application.service';
import { SubscriptionDataService } from './subscription.data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Subscription, Payment, HousingUnit, ResidentialComplex, Device, Log, Energy])],
  providers: [SubscriptionDataService, ApplicationService], 
  exports: [SubscriptionDataService, ApplicationService],
})
export class SubscriptionDataModule {}
