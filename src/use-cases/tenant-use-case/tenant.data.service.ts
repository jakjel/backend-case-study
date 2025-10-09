import { InternalServerErrorException, Injectable, OnModuleInit, NotFoundException, Inject } from '@nestjs/common';
import { faker } from '@faker-js/faker'; // Decided to use v7 since: https://github.com/faker-js/faker/issues/3606
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Tenant } from 'src/model/entities/tenant';

@Injectable()
export class TenantDataService implements OnModuleInit {
  constructor(
    @InjectRepository(Tenant)
    private readonly repo: Repository<Tenant>,
  ) { }

  async onModuleInit() {
    const count = await this.repo.count();
    console.log('Current tenants count:', count);
    // Seed initial data if none exists
    if (count === 0) {
      const items = Array.from({ length: 5 }).map(() =>
        this.repo.create({
          lastname: faker.name.firstName('male'),
          firstname: faker.name.lastName('male'),
          email: faker.internet.email(),
          password: faker.internet.password()
        }),
      );
      try {
        await this.repo.save(items);
        console.log('Seeded initial tenants:', items);
      } catch (error) {
        console.error('Failed to seed initial tenants:', error);
        throw new InternalServerErrorException('Failed to seed initial tenants', error.message); // není to good practice, mel bych mit custom exception handler
      }
    }
  }

  fetchAll() {
    try {
      return this.repo.find({
        relations: ['housingUnit', 'subscriptions', 'subscriptions.payments']
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch tenants', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }

  async getById(id: string): Promise<Tenant | null> {
    try {
      return await this.repo.findOne({
        where: { tenant_id: id },
        relations: ['housingUnit', 'subscriptions']
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to get tenant by ID', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }

  async updateTenant(
    tenantId: string,
    patch: DeepPartial<Tenant>,
  ): Promise<Tenant> {
    const tenant = await this.repo.findOne({
      where: { tenant_id: tenantId }
    });

    if (!tenant) {
      throw new Error(`Tenant with id ${tenantId} not found`);
    }

    Object.keys(patch).forEach((key) => {
      if (patch[key as keyof DeepPartial<Tenant>] !== undefined) {
        (tenant as any)[key] = patch[key as keyof DeepPartial<Tenant>];
      }
    });

    // Save and return updated tenant
    return await this.repo.save(tenant);
  }

  async createTenant(newTenant: Partial<Tenant>) {
    try {
      console.log('DataService - creating tenant:', newTenant);
      const saved = await this.repo.save(newTenant);
      console.log('DataService - created tenant:', saved);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create tenant', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }

  async deleteTenant(id: string) {
    return this.repo.delete(id);
  }
}
