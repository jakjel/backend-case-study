// src/entities/energy.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'energy' })
export class Energy {
  @PrimaryGeneratedColumn('uuid', { name: 'energy_id' })
  energy_id!: string;

  @Column({ name: 'price_per_kwh', type: 'numeric', precision: 10, scale: 4 })
  price_per_kwh!: string;

  @Column({ name: 'country', type: 'varchar', length: 2 })
  @Index()
  country!: string; // ISO-3166-1 alpha-2

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at!: Date;
}
