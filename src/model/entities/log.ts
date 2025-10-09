// src/entities/log.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, CreateDateColumn
} from 'typeorm';
import { Device } from './device';

@Entity({ name: 'log' })
export class Log {
  @PrimaryGeneratedColumn('uuid', { name: 'log_id' })
  log_id!: string;

  @ManyToOne(() => Device, (d) => d.logs, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'device_id', referencedColumnName: 'device_id' })
  device!: Device;

  @Column({ name: 'measuredAt', type: 'timestamptz' })
  @Index()
  measuredAt!: Date;

  @Column({ name: 'kwh', type: 'numeric', precision: 12, scale: 3 })
  kwh!: string;

  @Column({ name: 'note', type: 'text', nullable: true })
  note?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;
}
