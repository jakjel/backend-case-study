import { InternalServerErrorException, Injectable, OnModuleInit, NotFoundException, Inject } from '@nestjs/common';
import { faker } from '@faker-js/faker'; // Decided to use v7 since: https://github.com/faker-js/faker/issues/3606
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Subscription } from '../../model/entities/subscription'
import { Tenant } from '../../model/entities/tenant';

@Injectable()
export class SubscriptionDataService implements OnModuleInit {
  constructor(
    @InjectRepository(Subscription)
    private readonly repo: Repository<Subscription>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>
  ) { }

  async onModuleInit() {
    const count = await this.repo.count();
    console.log('Current subscriptions count:', count);
    // Seed initial data if none exists
    if (count === 0) {
      // First, get existing tenants to link subscriptions to them
      const tenants = await this.tenantRepo.find();

      if (tenants.length === 0) {
        console.log('No tenants found. Please seed tenants first.');
        return;
      }

      const items = Array.from({ length: 5 }).map((_, index) => {
        const startDate = faker.date.recent(Math.floor(Math.random() * 10) + 1);

        return this.repo.create({
          tenant: tenants[index % tenants.length],
          startDate: startDate,
          endDate: faker.date.soon(Math.floor(Math.random() * 10) + 1),
        });
      });
      try {
        await this.repo.save(items);
        console.log('Seeded initial tenants:', items);
      } catch (error) {
        console.error('Failed to seed initial tenants:', error);
        throw new InternalServerErrorException('Failed to seed initial tenants', error.message); // tento error handling není to good practice, mel bych mit custom exception handler
      }
    }
  }

  async fetchAll() {
    try {
      return await this.repo.find({
        relations: ['tenant']
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch tenants', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }

  async getById(id: string): Promise<Subscription | null> {
    try {
      return await this.repo.findOne({
        where: { subscription_id: id },
        relations: ['tenant']
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to get subscription by ID', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }

  async updateSubscription(
    subscriptionId: string,
    patch: DeepPartial<Subscription>,
  ): Promise<Subscription> {
    const subscription = await this.repo.findOne({
      where: { subscription_id: subscriptionId }
    });

    if (!subscription) {
      throw new Error(`Tenant with id ${subscriptionId} not found`);
    }

    Object.keys(patch).forEach((key) => {
      if (patch[key as keyof DeepPartial<Subscription>] !== undefined) {
        (subscription as any)[key] = patch[key as keyof DeepPartial<Subscription>];
      }
    });

    return await this.repo.save(subscription);
  }

  async createSubscription(newSubscription: Partial<Subscription>): Promise<Subscription> {
    try {
      const subscription = this.repo.create(newSubscription);
      return await this.repo.save(subscription);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create subscription', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }

  async cancelSubscription(id: string) {
    return this.repo.delete(id);
  }
}
