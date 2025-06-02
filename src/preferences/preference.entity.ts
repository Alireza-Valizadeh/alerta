import { Notification } from '../notifications/notification.entity';
import { BodyState } from '../common/entities/bodyState.entity';
import { ChassisState } from '../common/entities/chassisState.entity';
import { City } from '../common/entities/city.entity';
import { Color } from '../common/entities/color.entity';
import { EngineState } from '../common/entities/engineState.entity';
import { FuelType } from '../common/entities/fuelType.entity';
import { Gearbox } from '../common/entities/gearbox.entity';
import { Make } from '../common/entities/make.entity';
import { Model } from '../common/entities/model.entity';
import { State } from '../common/entities/state.entity';
import { User } from '../users/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreditTransaction } from '../credits/credit-transactions.entity';


@Entity({ name: 'Preferences' })
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.preferences)
  user: User;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string | null;

  @Column({ type: 'integer', nullable: true })
  minYear: number | null;

  @Column({ type: 'integer', nullable: true })
  maxYear: number | null;

  @Column({ type: 'integer', nullable: true })
  minInsuranceDuration: number | null;

  @Column({ type: 'integer', nullable: true })
  maxInsuranceDuration: number | null;

  @Column({ type: 'bigint', nullable: true })
  minMileage: number | null;

  @Column({ type: 'bigint', nullable: true })
  maxMileage: number | null;

  @Column({ type: 'bigint', nullable: true })
  minPrice: number | null;

  @Column({ type: 'bigint', nullable: true })
  maxPrice: number | null;

  @ManyToOne(() => Make, (make) => make.preferences)
  @JoinColumn({ name: 'makeId' })
  make: Make;

  @ManyToOne(() => Model, (model) => model.preferences)
  @JoinColumn({ name: 'modelId' })
  model: Model;

  @ManyToOne(() => State, (state) => state.preferences)
  @JoinColumn({ name: 'stateId' })
  state: State;

  @ManyToOne(() => City, (city) => city.preferences, { nullable: true })
  @JoinColumn({ name: 'cityId' })
  city: City;

  @ManyToMany(() => Color, (color) => color.preferences)
  colors: Color[];

  @ManyToMany(() => Gearbox, (gearbox) => gearbox.preferences)
  gearboxes: Gearbox[];

  @ManyToMany(() => FuelType, (fuelType) => fuelType.preferences)
  fuelTypes: FuelType[];

  @ManyToMany(() => EngineState, (engineState) => engineState.preferences)
  engineStates: EngineState[];

  @ManyToMany(() => ChassisState, (chassisState) => chassisState.preferences)
  chassisStates: ChassisState[];

  @ManyToMany(() => BodyState, (bodyState) => bodyState.preferences)
  bodyStates: BodyState[];

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => Notification, (notification) => notification.preference)
  notifications: Notification[];

  @OneToMany(() => CreditTransaction, (credit) => credit.preference)
  creditTransactions: CreditTransaction[];

  @Column({ type: 'boolean', default: false })
  isDisabled: boolean;
}
