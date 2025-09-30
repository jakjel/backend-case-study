import { InternalServerErrorException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Customer } from '../model/customer';
import { faker } from '@faker-js/faker'; // Decided to use v7 since: https://github.com/faker-js/faker/issues/3606

@Injectable()
export class DataService implements OnModuleInit {
  private readonly data: Array<Customer>;

  constructor() {
    this.data = [];
  }

  // Generates 5 random users on module init
  onModuleInit() {
    this.loadRandomInitialData();
  }

  // Private helper functions
  private loadRandomInitialData() {
    this.data.push(...Array.from({ length: 5 }, () => this.createRandomUser()));
  }

  private createRandomUser(): Customer {
    const customer = new Customer({
      userId: faker.datatype.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      password: faker.internet.password(),
      birthday: faker.date.past(40, new Date(2005, 0, 1)),
      registeredAt: faker.date.past(5),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    });
    return customer;
  }

  private findCustomerIndexById(id: string): number {
    let index = this.data.findIndex(customer => customer.userId === id);
    if (index === -1) {
      throw new NotFoundException('Customer not found');
    } else {
      return index;
    }
  }

  private findCustomerById(id: string): Customer {
    const index = this.findCustomerIndexById(id);
    return this.data[index];
  }

  async fetchAll(): Promise<Array<Customer>> {
    return this.data;
  }

  async getById(id: string): Promise<Customer> {
    return this.findCustomerById(id);
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const existingCustomer = this.findCustomerById(id);
    try {
      Object.keys(customer).forEach((key) => {
        if (customer[key] !== undefined) {
          existingCustomer[key] = customer[key];
        }
      });

      const index = this.findCustomerIndexById(id);
      this.data[index] = existingCustomer;
      return existingCustomer;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update customer: ${error.message}`);
    }
  }

  async createCustomer(newCustomer: Partial<Customer>): Promise<Customer> {
    const customer = new Customer({
      ...newCustomer,
      userId: faker.datatype.uuid(),
      registeredAt: new Date(),
    });

    this.data.push(customer);

    return customer;
  }

}
