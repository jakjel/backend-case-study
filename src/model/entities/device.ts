// src/entities/device.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne
} from 'typeorm';
import { Log } from './log';
import { HousingUnit } from './housing-unit';

@Entity({ name: 'device' })
export class Device {
  @PrimaryGeneratedColumn('uuid', { name: 'device_id' })
  device_id!: string;

  @Column({ name: 'status', type: 'varchar', length: 30 })
  status!: string;

  // Use separate Log rows instead of an array column
  @OneToMany(() => Log, (l) => l.device, { cascade: false })
  logs!: Log[];

  // inverse of HousingUnit.device
  @OneToOne(() => HousingUnit, (u) => u.device)
  housingUnit?: HousingUnit | null;
}
