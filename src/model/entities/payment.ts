// src/entities/payment.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  CreateDateColumn, Index
} from 'typeorm';
import { Subscription } from './subscription';
import { PaymentStatus } from './enums';

@Entity({ name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_id' })
  payment_id!: string;

  @ManyToOne(() => Subscription, (s) => s.payments, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscription_id', referencedColumnName: 'subscription_id' })
  subscription!: Subscription;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamptz' })
  @Index()
  createdAt!: Date;

  @Column({ name: 'amount', type: 'numeric', precision: 12, scale: 2 })
  amount!: string; // keep as string when using numeric

  @Column({ name: 'currency', type: 'char', length: 3 })
  currency!: string; // ISO 4217 e.g. 'EUR'

  @Column({ name: 'status', type: 'varchar', length: 20, default: PaymentStatus.PENDING })
  status!: PaymentStatus;
}
