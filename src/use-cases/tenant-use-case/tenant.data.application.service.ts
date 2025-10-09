import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantDataService } from './tenant.data.service';
import { TenantResponseDTO } from '../../model/entities/tenant-dtos/tenant-response.dto';
import { TenantMapper } from '../../model/entities/tenant-dtos/tenant.mapper'
import { UpdateTenantDTO } from '../../model/entities/tenant-dtos/tenant-update.dto';
import { CreateTenantDTO } from '../../model/entities/tenant-dtos/tenant-create.dto';



@Injectable()
export class ApplicationService {
    constructor(private readonly tenantService: TenantDataService) { }

    async fetchAll(): Promise<Array<TenantResponseDTO>> {
        const tenants = await this.tenantService.fetchAll();
        return TenantMapper.toResponseDTOs(tenants);
    }

    async getById(id: string): Promise<TenantResponseDTO> {
        const tenant = await this.tenantService.getById(id);
        if (tenant != null) {
            return TenantMapper.toResponseDTO(tenant);
        }
        throw new BadRequestException('Bad request'); // Should be better error handling
    }

    async updateTenant(id: string, newTenantDTO: UpdateTenantDTO): Promise<TenantResponseDTO> {
        const tenantDomain = TenantMapper.toDomain(newTenantDTO);
        const updatedTenant = await this.tenantService.updateTenant(id, tenantDomain);
        if (updatedTenant != null) {
            return TenantMapper.toResponseDTO(updatedTenant!);
        }
        throw new BadRequestException('Bad request'); // Should be better error handling
    }

    async createTenant(newTenantDTO: CreateTenantDTO): Promise<TenantResponseDTO> {
        const tenantDomain = TenantMapper.toDomainCreate(newTenantDTO);
        const updatedTenant = await this.tenantService.createTenant(tenantDomain);
        return TenantMapper.toResponseDTO(updatedTenant);
    }

    async removeTenant(id: string) {
        const response = await this.tenantService.deleteTenant(id);
        return response;
    }

}