import { Model } from '../common/entities/model.entity';
import { Make } from '../common/entities/make.entity';
import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Color } from '../common/entities/color.entity';
import { State } from '../common/entities/state.entity';
import { City } from '../common/entities/city.entity';
import { Gearbox } from '../common/entities/gearbox.entity';
import { FuelType } from '../common/entities/fuelType.entity';
import { EngineState } from '../common/entities/engineState.entity';
import { ChassisState } from '../common/entities/chassisState.entity';
import { BodyState } from '../common/entities/bodyState.entity';

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
  make: Make;

  @ManyToOne(() => Model, (model) => model.listings)
  @JoinColumn({ name: 'modelId' })
  model: Model;

  @Column({ type: 'integer' })
  year: number;

  @ManyToOne(() => Color, (color) => color.listings)
  @JoinColumn({ name: 'colorId' })
  color: Color;

  @Column({ type: 'bigint' })
  mileage: number;

  @ManyToOne(() => State, (state) => state.listings)
  @JoinColumn({ name: 'stateId' })
  state: State;

  @ManyToOne(() => City, (city) => city.listings)
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Column({ type: 'integer', nullable: true })
  insuranceDuration: number;

  @ManyToOne(() => Gearbox, (gearbox) => gearbox.listings)
  @JoinColumn({ name: 'gearboxId' })
  gearbox: Gearbox;

  @ManyToOne(() => FuelType, (fuelType) => fuelType.listings)
  @JoinColumn({ name: 'fuelTypeId' })
  fuelType: FuelType;

  @Column({ type: 'bigint' })
  price: number;

  @ManyToOne(() => EngineState, (engineState) => engineState.listings)
  @JoinColumn({ name: 'engineStateId' })
  engineState: EngineState;

  @ManyToOne(() => ChassisState, (chassisState) => chassisState.listings)
  @JoinColumn({ name: 'chassisStateId' })
  chassisState: ChassisState;

  @ManyToOne(() => BodyState, (bodyState) => bodyState.listings)
  @JoinColumn({ name: 'bodyStateId' })
  bodyState: BodyState;

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
