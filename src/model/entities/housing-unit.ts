// src/entities/housing-unit.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  OneToOne, CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';
import { ResidentialComplex } from './residential-complex';
import { Device } from './device';
import { Tenant } from './tenant';
import { ElectricityStatus } from './enums';

@Entity({ name: 'housing_unit' })
export class HousingUnit {
  @PrimaryGeneratedColumn('uuid', { name: 'housing_unit_id' })
  housing_unit_id!: string;

  @ManyToOne(() => ResidentialComplex, (rc) => rc.housing_units, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'residential_complex_id', referencedColumnName: 'residential_complex_id' })
  residentialComplex!: ResidentialComplex;

  // 1:1 to Device – FK here
  @OneToOne(() => Device, (d) => d.housingUnit, { nullable: true })
  @JoinColumn({ name: 'device_id', referencedColumnName: 'device_id' })
  device?: Device | null;

  // housing-unit.entity.ts  (inverse side, bez JoinColumn)
  @OneToOne(() => Tenant, (t) => t.housingUnit)
  tenant?: Tenant | null;

  @Column({ name: 'currentEnergyUsage', type: 'numeric', precision: 14, scale: 3, default: 0 })
  currentEnergyUsage!: string;

  @Column({ name: 'status_electricity', type: 'varchar', length: 20, default: ElectricityStatus.ACTIVE })
  status_electricity!: ElectricityStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at!: Date;
}
