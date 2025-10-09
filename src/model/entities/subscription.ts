// src/entities/subscription.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, UpdateDateColumn, Index,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { Tenant } from './tenant';
import { Payment } from './payment';

@Entity({ name: 'subscription' })
export class Subscription {
  @PrimaryGeneratedColumn('uuid', { name: 'subscription_id' })
  subscription_id: string;

  @ManyToOne(() => Tenant, (t) => t.subscriptions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id', referencedColumnName: 'tenant_id' })
  @Index()
  tenant!: Tenant;

  @Column({ name: 'startDate', type: 'timestamptz' })
  @Index()
  startDate!: Date;

  @Column({ name: 'endDate', type: 'timestamptz' })
  @Index()
  endDate!: Date;

  @UpdateDateColumn({ name: 'createdAt', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'prepaidKWh', default: 0 })
  prepaidKWh: number;

  @OneToMany(() => Payment, (p) => p.subscription, { cascade: false })
  payments: Payment[];
}
