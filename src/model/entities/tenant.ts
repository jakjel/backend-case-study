// src/entities/tenant.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, Index, OneToOne,
  CreateDateColumn, UpdateDateColumn,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Subscription } from './subscription';
import { HousingUnit } from './housing-unit';

@Entity({ name: 'tenant' })
export class Tenant {
  @PrimaryGeneratedColumn('uuid', { name: 'tenant_id' })
  tenant_id!: string;

  @Column({ name: 'lastname', type: 'varchar', length: 120 })
  @Index()
  lastname!: string;

  @Column({ name: 'firstname', type: 'varchar', length: 120 })
  firstname!: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'password', type: 'varchar', length: 120 })
  password!: string;

  // Tenant owns the relation (FK columns live here)
  @OneToOne(() => HousingUnit, { nullable: true })
  @JoinColumn({ name: 'housing_unit_id' })
  housingUnit?: HousingUnit | null;

  @OneToMany(() => Subscription, (s) => s.tenant, { cascade: false })
  subscriptions?: Subscription[] | null; 

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at!: Date;
}
