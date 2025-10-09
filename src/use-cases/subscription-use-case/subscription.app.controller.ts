import { Controller, Get, Param, Post, Body, Put, HttpCode, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApplicationService } from './subscription.application.service';
import { SubscriptionResponseDTO } from '../../model/entities/subscription-dtos/subscription-response.dto';
import { CreateSubscriptionDTO } from '../../model/entities/subscription-dtos/subscription-create.dto';

@ApiTags('Subscriptions')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly applicationService: ApplicationService) { 
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all subscriptions' })
  async fetchAll(): Promise<Array<SubscriptionResponseDTO>> {
    return this.applicationService.fetchAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription by ID' })
  async getById(@Param('id') id: string): Promise<SubscriptionResponseDTO> {
    return this.applicationService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  async createSubscription(@Body() subscriptionDTO: CreateSubscriptionDTO): Promise<SubscriptionResponseDTO> {
    console.log('AppController - creating subscription with subscription:', subscriptionDTO);
    const createdSubscription = this.applicationService.createSubscription(subscriptionDTO); 
    console.log('AppController - created subscription:', createdSubscription);
    return createdSubscription;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel existing subscription' })
  async cancel(@Param('id') id: string): Promise<void> {
    await this.applicationService.cancelSubscription(id);
  }

}
