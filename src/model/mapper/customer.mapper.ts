import { Customer } from '../customer';
import { CreateCustomerDTO } from '../customer-create.dto';
import { UpdateCustomerDTO } from '../customer-update.dto';
import { CustomerResponseDTO } from '../customer-response.dto';

export class CustomerMapper {


    // Domain -> DTO 
    static toResponseDTO(customer: Customer): CustomerResponseDTO {
        return{
            userId: customer.userId,
            username: customer.username,
            email: customer.email,
            avatar: customer.avatar,
            birthday: customer.birthday,
            firstName: customer.firstName,
            lastName: customer.lastName,
            registeredAt: customer.registeredAt
        };
    }

    static toResponseDTOs(customers: Customer[]): CustomerResponseDTO[] {
        const resolvedCustomers = customers;
        return resolvedCustomers.map(customer => this.toResponseDTO(customer));
    }

    // DTO -> Domain (create)
    static toDomainCreate(dto: CreateCustomerDTO): Partial<Customer> {
        return {
            username: dto.username,
            email: dto.email,
            password: dto.password,
            avatar: dto.avatar,
            birthday: dto.birthday,
            firstName: dto.firstName,
            lastName: dto.lastName,
        }
    }

    // DTO -> Domain (update)
    static toDomain(dto: UpdateCustomerDTO): Partial<Customer> {
        return {
            username: dto.username,
            avatar: dto.avatar,
            birthday: dto.birthday,
            firstName: dto.firstName,
            lastName: dto.lastName
        };
    }
}