import { InternalServerErrorException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Customer } from '../model/customer';
import { faker } from '@faker-js/faker'; // Decided to use v7 since: https://github.com/faker-js/faker/issues/3606
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DataService implements OnModuleInit {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
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

  async updateCustomer(id: string, patch: Partial<Customer>) {
    try {
    await this.repo.update({ userId: id }, patch);
    return this.repo.findOneBy({ userId: id });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update customer', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }

  async createCustomer(newCustomer: Partial<Customer>) {
    try {
      const saved = await this.repo.save(newCustomer);
      return saved;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create customer', error.message); // není to good practice, mel bych mit custom exception handler
    }
  }
}
