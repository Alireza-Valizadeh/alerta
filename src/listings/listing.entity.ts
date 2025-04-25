import { Model } from '../common/model.entity';
import { Make } from '../common/make.entity';
import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Color } from '../common/color.entity';
import { State } from '../common/state.entity';
import { City } from '../common/city.entity';
import { Gearbox } from '../common/gearbox.entity';
import { FuelType } from '../common/fuelType.entity';
import { EngineState } from '../common/engineState.entity';
import { ChassisState } from '../common/chassisState.entity';
import { BodyState } from '../common/bodyState.entity';

@Entity({ name: 'Listings' })
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.listings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @ManyToOne(() => Make, (make) => make.listings)
  @JoinColumn({ name: 'makeId' })
  make: string;

  @ManyToOne(() => Model, (model) => model.listings)
  @JoinColumn({ name: 'modelId' })
  model: string;

  @Column({ type: 'integer' })
  year: number;

  @ManyToOne(() => Color, (color) => color.listings)
  @JoinColumn({ name: 'colorId' })
  color: string;

  @Column({ type: 'bigint' })
  mileage: number;

  @ManyToOne(() => State, (state) => state.listings)
  @JoinColumn({ name: 'stateId' })
  state: string;

  @ManyToOne(() => City, (city) => city.listings)
  @JoinColumn({ name: 'cityId' })
  city: string;

  @Column({ type: 'integer' })
  insuranceDuration: number;

  @ManyToOne(() => Gearbox, (gearbox) => gearbox.listings)
  @JoinColumn({ name: 'gearboxId' })
  gearbox: string;

  @ManyToOne(() => FuelType, (fuelType) => fuelType.listings)
  @JoinColumn({ name: 'fuelTypeId' })
  fuelType: string;

  @Column({ type: 'bigint' })
  price: number;

  @ManyToOne(() => EngineState, (engineState) => engineState.listings)
  @JoinColumn({ name: 'engineStateId' })
  engineState: string;

  @ManyToOne(() => ChassisState, (chassisState) => chassisState.listings)
  @JoinColumn({ name: 'chassisStateId' })
  chassisState: string;

  @ManyToOne(() => BodyState, (bodyState) => bodyState.listings)
  @JoinColumn({ name: 'bodyStateId' })
  bodyState: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ type: 'boolean', default: false })
  isSold: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  soldAt: Date | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
