import { Tenant } from '../tenant';
import { CreateTenantDTO } from '../tenant-dtos/tenant-create.dto';
import { UpdateTenantDTO } from '../tenant-dtos/tenant-update.dto';
import { TenantResponseDTO } from '../tenant-dtos/tenant-response.dto';

export class TenantMapper {


    // Domain -> DTO 
    static toResponseDTO(tenant: Tenant): TenantResponseDTO {
        return{
            tenant_id: tenant.tenant_id,
            email: tenant.email,
            firstname: tenant.firstname,
            lastname: tenant.lastname,
            created_at: tenant.created_at,
            updated_at: tenant.updated_at,
            subscriptions: tenant.subscriptions ?? undefined,
            housingUnit: tenant.housingUnit ?? undefined
        };
    }

    static toResponseDTOs(tenants: Tenant[]): TenantResponseDTO[] {
        const resolvedCustomers = tenants;
        return resolvedCustomers.map(tenant => this.toResponseDTO(tenant));
    }

    // DTO -> Domain (create)
    static toDomainCreate(dto: CreateTenantDTO): Partial<Tenant> {
        return {
            firstname: dto.firstname,
            lastname: dto.lastname,
            email: dto.email,
            password: dto.password
        }
    }

    // DTO -> Domain (update)
    static toDomain(dto: UpdateTenantDTO): Partial<Tenant> {
        return {
            firstname: dto.firstname,
            lastname: dto.lastname,
            email: dto.email
        };
    }
}