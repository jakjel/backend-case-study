import { BadRequestException, Injectable } from '@nestjs/common';
import { DataService } from './data.service';
import { UpdateCustomerDTO } from '../model/customer-update.dto';
import { CustomerResponseDTO } from '../model/customer-response.dto';
import { CustomerMapper } from '../model/mapper/customer.mapper';
import { CreateCustomerDTO } from 'src/model/customer-create.dto';

@Injectable()
export class ApplicationService {
    constructor(private readonly customerService: DataService) { }

    async fetchAll(): Promise<Array<CustomerResponseDTO>> {
        const customers = await this.customerService.fetchAll();
        return customers.map(customer => CustomerMapper.toResponseDTO(customer));
    }

    async getById(id: string): Promise<CustomerResponseDTO> {
        const customer = await this.customerService.getById(id);
        if (customer != null) {
            return CustomerMapper.toResponseDTO(customer);
        }
        throw new BadRequestException('Bad request'); // Should be better error handling
    }

    async updateCustomer(id: string, newCustomerDTO: UpdateCustomerDTO): Promise<CustomerResponseDTO> {
        const customerDomain = CustomerMapper.toDomain(newCustomerDTO);
        const updatedCustomer = await this.customerService.updateCustomer(id, customerDomain);
        if (updatedCustomer != null) {
            return CustomerMapper.toResponseDTO(updatedCustomer!);
        }
        throw new BadRequestException('Bad request'); // Should be better error handling
    }

    async createCustomer(newCustomerDTO: CreateCustomerDTO): Promise<CustomerResponseDTO> {
        const customerDomain = CustomerMapper.toDomainCreate(newCustomerDTO);
        const updatedCustomer = await this.customerService.createCustomer(customerDomain);
        return CustomerMapper.toResponseDTO(updatedCustomer);
    }

}