import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  Index,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Subscription } from './subscription';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Index({ unique: true })
  @Column()
  username: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @CreateDateColumn()
  registeredAt: Date;

  @OneToOne(() => Subscription, (s) => s.customer, {
    nullable: true,
    cascade: ['insert', 'update'],
    eager: true, 
  })
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription | null;

  constructor(data?: Partial<Customer>) {
    Object.assign(this, data);
  }
}
