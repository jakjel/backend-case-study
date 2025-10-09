// src/entities/residential-complex.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { HousingUnit } from './housing-unit';

@Entity({ name: 'residential_complex' })
export class ResidentialComplex {
  @PrimaryGeneratedColumn('uuid', { name: 'residential_complex_id' })
  residential_complex_id!: string;

  @Column({ name: 'address', type: 'varchar', length: 255 })
  address!: string;

  @OneToMany(() => HousingUnit, (u) => u.residentialComplex)
  housing_units!: HousingUnit[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at!: Date;
}
