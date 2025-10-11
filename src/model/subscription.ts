import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, UpdateDateColumn, Index
} from 'typeorm';
import { Customer } from './customer';
import { SubscriptionType } from './subscription-type';
import { ApiProperty } from '@nestjs/swagger';

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Customer, (customer) => customer.subscription, { onDelete: 'CASCADE' })
    customer: Customer;

    @CreateDateColumn() 
    createdAt: Date;

    @UpdateDateColumn() 
    updatedAt: Date;

    @ApiProperty({ enum: SubscriptionType, required: true})
    @Column({ type: 'enum', enum: SubscriptionType, nullable: true })
    subscriptionType?: SubscriptionType;

    @ApiProperty({required: true})
    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @ApiProperty({required: true})
    @Column({ type: 'date', nullable: true })
    endDate: Date;

    constructor(data?: Partial<Subscription>) {
        Object.assign(this, data);
    }
}
