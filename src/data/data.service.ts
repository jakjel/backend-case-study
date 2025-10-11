import { InternalServerErrorException, Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { Customer } from '../model/customer';
import { faker } from '@faker-js/faker'; // Decided to use v7 since: https://github.com/faker-js/faker/issues/3606
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Subscription } from '../model/subscription';

@Injectable()
export class DataService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
    @InjectRepository(Subscription) 
    private readonly subRepo: Repository<Subscription>,
  ) { }

  async onModuleInit() {
    const count = await this.repo.count();
    console.log('Current customer count:', count);
    // Seed initial data if none exists
    if (count === 0) {
      const items = Array.from({ length: 5 }).map(() =>
        this.repo.create({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          password: faker.internet.password(),
          birthday: faker.date.past(40, new Date(2005, 0, 1)),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        }),
      );
      try {
      await this.repo.save(items);
      console.log('Seeded initial customers:', items);
      } catch (error) {
        console.error('Failed to seed initial customers:', error);
        throw new InternalServerErrorException('Failed to seed initial customers', error.message); // není to good practice, mel bych mit custom exception handler
      }
    }
  }

  fetchAll() {
    try {
      return this.repo.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch customers', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }

  getById(id: string) {
    try {
    return this.repo.findOneBy({ userId: id });
    } catch (error) {
      throw new InternalServerErrorException('Failed to get customer by ID', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }

  async updateCustomer(id: string, patch: DeepPartial<Customer>) {
    try {
      return await this.dataSource.transaction(async (tm) => {
        const customerRepo = tm.getRepository(Customer);
        const subRepo = tm.getRepository(Subscription);

        const existing = await customerRepo.findOne({
          where: { userId: id },
          relations: { subscription: true },
        });
        if (!existing) throw new NotFoundException('Customer not found');

        // Split scalar fields vs. relation
        const { subscription: subPatch, ...customerPatch } = patch;

        // Merge only defined scalar fields
        Object.entries(customerPatch).forEach(([k, v]) => {
          if (v !== undefined) (existing as any)[k] = v;
        });

        // Handle subscription explicitly
        if (subPatch !== undefined) {
          if (subPatch === null) {
            // detach subscription
            existing.subscription = null;
          } else if ((subPatch as any).id) {
            // update existing subscription
            const preloaded = await subRepo.preload(subPatch as DeepPartial<Subscription>);
            if (!preloaded) throw new NotFoundException('Subscription not found');
            existing.subscription = await subRepo.save(preloaded);
          } else {
            // create new subscription
            const created = subRepo.create(subPatch as DeepPartial<Subscription>);
            existing.subscription = await subRepo.save(created);
          }
        }

        // Save customer (triggers cascades for relation already attached)
        return await customerRepo.save(existing);
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update customer', { cause: error });
    }
  }

  async createCustomer(newCustomer: Partial<Customer>) {
    try {
      console.log('DataService - creating customer:', newCustomer);
      const saved = await this.repo.save(newCustomer);
      console.log('DataService - created customer:', saved);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create customer', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }
}
