import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Listings' })
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.listings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'enum', length: 50 })
  make: string;

  @Column({ type: 'enum', length: 50 })
  model: string;

  @Column({ type: 'integer', length: 4 })
  year: number;

  @Column({ type: 'enum' })
  color: string;

  @Column({ type: 'long' })
  mileage: number;

  @Column({ type: 'enum', length: 50 })
  state: string;

  @Column({ type: 'enum', length: 50 })
  city: string;

  @Column({ type: 'integer' })
  insuranceDuration: number;

  @Column({ type: 'enum' })
  gearbox: string;

  @Column({ type: 'enum' })
  fuelType: string;

  @Column({ type: 'long' })
  price: number;

  @Column({ type: 'enum' })
  engineState: string;

  @Column({ type: 'enum' })
  chassisState: string;

  @Column({ type: 'enum' })
  bodyState: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @Column({ type: 'boolean', default: false })
  isSold: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  soldAt: Date | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
