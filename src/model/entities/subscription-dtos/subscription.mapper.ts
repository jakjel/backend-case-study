import { CreateSubscriptionDTO } from './subscription-create.dto';
import { Subscription } from '../subscription';
import { SubscriptionResponseDTO } from './subscription-response.dto';
import { Tenant } from '../tenant';

export class SubscriptionMapper {

    // Domain -> DTO 
    static toResponseDTO(subscription: Subscription): SubscriptionResponseDTO {
        return {
            subscriptionId: subscription.subscription_id,
            createdAt: subscription.createdAt,
            tenant: subscription.tenant,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            prepaidKWh: subscription.prepaidKWh
        };
    }

    static toResponseDTOs(subscription: Subscription[]): SubscriptionResponseDTO[] {
        const resolvedSubscriptions = subscription;
        return resolvedSubscriptions.map(subscription => this.toResponseDTO(subscription));
    }

    // DTO -> Domain (create)
    static toDomainCreate(createSubscriptionDTO: CreateSubscriptionDTO): Partial<Subscription> {
        return {
            startDate: createSubscriptionDTO.startDate,
            endDate: createSubscriptionDTO.endDate,
            tenant: { tenant_id: createSubscriptionDTO.tenant_id } as Tenant,
            prepaidKWh: createSubscriptionDTO.prepaidKWh
        }
    }

}