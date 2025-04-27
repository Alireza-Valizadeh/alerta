import { Listing } from '../../listings/listing.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Make } from './make.entity';

@Entity({ name: 'Models' })
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  title: string;

  @ManyToOne(() => Make, (make) => make.models)
  make: Make;

  @OneToMany(() => Listing, (listing) => listing.model)
  listings: Listing[];
}
