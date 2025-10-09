import { Module } from '@nestjs/common';
import { TenantDataService } from './tenant.data.service';
import { ApplicationService } from './tenant.data.application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../../model/entities/tenant';
import { Payment } from '../../model/entities/payment';
import { Subscription } from '../../model/entities/subscription';
import { HousingUnit } from '../../model/entities/housing-unit';
import { ResidentialComplex } from '../../model/entities/residential-complex';
import { Device } from '../../model/entities/device';
import { Log } from '../../model/entities/log';
import { Energy } from '../../model/entities/energy';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Subscription, Payment, HousingUnit, ResidentialComplex, Device, Log, Energy])],
  providers: [TenantDataService, ApplicationService], 
  exports: [TenantDataService, ApplicationService],
})
export class TenantDataModule {}
