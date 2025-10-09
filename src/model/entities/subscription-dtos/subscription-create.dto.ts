// src/dtos/create-subscription.dto.ts
import { IsDate, IsDateString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSubscriptionDTO {
    @ApiProperty({
        description: 'UUID of the tenant',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    tenant_id!: string;

    @ApiProperty({
        description: 'Subscription start date',
        example: '2025-01-01T00:00:00Z'
    })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    startDate!: Date;

    @ApiProperty({
        description: 'Subscription end date',
        example: '2025-12-31T23:59:59Z'
    })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    endDate!: Date;

    @ApiProperty({
        description: 'Prepaid KWH',
        example: '100'
    })
    @IsNotEmpty()
    prepaidKWh!: number;
}