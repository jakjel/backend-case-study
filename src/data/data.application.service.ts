import { Injectable } from '@nestjs/common';
import { DataService } from './data.service';
import { UpdateCustomerDTO } from '../model/customer-update.dto';
import { CustomerResponseDTO } from '../model/customer-response.dto';
import { CustomerMapper } from '../model/mapper/customer.mapper';

@Injectable()
export class ApplicationService {
    constructor(private readonly customerService: DataService) { }

    async fetchAll(): Promise<Array<CustomerResponseDTO>> {
        const customers = await this.customerService.fetchAll();
        return customers.map(customer => CustomerMapper.toResponseDTO(customer));
    }

    async getById(id: string): Promise<CustomerResponseDTO> {
        const customer = await this.customerService.getById(id);
        return CustomerMapper.toResponseDTO(customer);
    }

    async updateCustomer(id: string, newCustomerDTO: UpdateCustomerDTO): Promise<CustomerResponseDTO> {
        console.log('Received partial customer (Application layer) - UpdateCustomerDTO:', newCustomerDTO); // DEBUG

        const customerDomain = CustomerMapper.toDomain(newCustomerDTO);

        console.log('Received partial customer (Application layer) - Customer:', customerDomain); // DEBUG

        const updatedCustomer = await this.customerService.updateCustomer(id, customerDomain);

        console.log('Received partial customer (Application layer) - Customer:', updatedCustomer); // DEBUG

        return CustomerMapper.toResponseDTO(updatedCustomer);
    }

    async createCustomer(newCustomerDTO: UpdateCustomerDTO): Promise<CustomerResponseDTO> {
        const customerDomain = CustomerMapper.toDomain(newCustomerDTO);

        const updatedCustomer = await this.customerService.createCustomer(customerDomain);

        return CustomerMapper.toResponseDTO(updatedCustomer);
    }

}