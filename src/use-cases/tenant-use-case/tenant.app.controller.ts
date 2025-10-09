import { Controller, Get, Param, Post, Body, Put, HttpCode, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApplicationService } from './tenant.data.application.service';
import { TenantResponseDTO } from '../../model/entities/tenant-dtos/tenant-response.dto';
import { CreateTenantDTO } from '../../model/entities/tenant-dtos/tenant-create.dto';
import { UpdateTenantDTO } from '../../model/entities/tenant-dtos/tenant-update.dto';

@ApiTags('Tenants')
@Controller('tenant')
export class TenantController {
  constructor(private readonly applicationService: ApplicationService) { 
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all tenants' })
  async fetchAll(): Promise<Array<TenantResponseDTO>> {
    return this.applicationService.fetchAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  async getById(@Param('id') id: string): Promise<TenantResponseDTO> {
    return this.applicationService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  async createTenant(@Body() tenantDTO: CreateTenantDTO): Promise<TenantResponseDTO> {
    console.log('AppController - creating tenant with subscription:', tenantDTO);
    const createdTenant = this.applicationService.createTenant(tenantDTO); 
    console.log('AppController - created tenant:', createdTenant);
    return createdTenant;
  }

  @Put(':id')
  @HttpCode(201)
  @ApiOperation({ summary: 'Update an existing tenant' })
  async update(@Param('id') id: string, @Body() newTenantDTO: UpdateTenantDTO): Promise<TenantResponseDTO> {
    return this.applicationService.updateTenant(id, newTenantDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove existing tenant' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.applicationService.removeTenant(id);
  }

}
