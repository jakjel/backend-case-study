import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriptionDataService } from './subscription.data.service';
import { SubscriptionResponseDTO } from '../../model/entities/subscription-dtos/subscription-response.dto';
import { SubscriptionMapper } from '../../model/entities/subscription-dtos/subscription.mapper';
import { CreateSubscriptionDTO } from '../..//model/entities/subscription-dtos/subscription-create.dto';



@Injectable()
export class ApplicationService {
    constructor(private readonly subscriptionService: SubscriptionDataService) { }

    async fetchAll(): Promise<SubscriptionResponseDTO[]> {
        const subscriptions = await this.subscriptionService.fetchAll();
        return SubscriptionMapper.toResponseDTOs(subscriptions);
    }

    async getById(id: string): Promise<SubscriptionResponseDTO> {
        const subscription = await this.subscriptionService.getById(id);
        if (subscription != null) {
            return SubscriptionMapper.toResponseDTO(subscription);
        }
        throw new BadRequestException('Bad request'); // Should be better error handling
    }

    async createSubscription(newSubscriptionDTO: CreateSubscriptionDTO): Promise<SubscriptionResponseDTO> {
        const subscriptionDomain = SubscriptionMapper.toDomainCreate(newSubscriptionDTO);
        const updatedSubscription = await this.subscriptionService.createSubscription(subscriptionDomain);
        return SubscriptionMapper.toResponseDTO(updatedSubscription);
    }

    async cancelSubscription(id: string) {
        const response = await this.subscriptionService.cancelSubscription(id);
        return response;
    }

}