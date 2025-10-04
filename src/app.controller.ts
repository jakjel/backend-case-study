import { Controller, Get, Param, Post, Body, Put, HttpCode } from '@nestjs/common';
import { UpdateCustomerDTO } from './model/customer-update.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateCustomerDTO } from './model/customer-create.dto';
import { CustomerResponseDTO } from './model/customer-response.dto';
import { ApplicationService } from './data/data.application.service';

@ApiTags('Customers')
@Controller()
export class AppController {
  constructor(private readonly applicationService: ApplicationService) { 
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all customers' })
  async fetchAll(): Promise<Array<CustomerResponseDTO>> {
    return this.applicationService.fetchAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  async getById(@Param('id') id: string): Promise<CustomerResponseDTO> {
    return this.applicationService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  async createCustomer(@Body() customerDTO: CreateCustomerDTO): Promise<CustomerResponseDTO> {
    return this.applicationService.createCustomer(customerDTO);
  }

  @Put(':id')
  @HttpCode(201)
  @ApiOperation({ summary: 'Update an existing customer' })
  async update(@Param('id') id: string, @Body() newCustomerDTO: UpdateCustomerDTO): Promise<CustomerResponseDTO> {
    return this.applicationService.updateCustomer(id, newCustomerDTO);
  }
}
