import { Module } from '@nestjs/common';
import { TenantController } from './use-cases/tenant-use-case/tenant.app.controller';
import { TenantDataModule } from './use-cases/tenant-use-case/tenant.data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './model/entities/subscription';
import { Tenant } from './model/entities/tenant';
import { Payment } from './model/entities/payment';
import { HousingUnit } from './model/entities/housing-unit';
import { ResidentialComplex } from './model/entities/residential-complex';
import { Device } from './model/entities/device';
import { Log } from './model/entities/log';
import { Energy } from './model/entities/energy';
import { SubscriptionController } from './use-cases/subscription-use-case/subscription.app.controller';
import { SubscriptionDataModule } from './use-cases/subscription-use-case/subscription.data.module';

@Module({
  imports: [SubscriptionDataModule, TenantDataModule, TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Tenant, Subscription, Payment, HousingUnit, ResidentialComplex, Device, Log, Energy],
    autoLoadEntities: true,
    synchronize: true,
    retryAttempts: 10,
    retryDelay: 3000,
  }),
  ],
  controllers: [TenantController, SubscriptionController],
})
export class AppModule { }
