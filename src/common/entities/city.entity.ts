import { Listing } from '../../listings/listing.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from './state.entity';
import { Preference } from '../../preferences/preference.entity';

@Entity({ name: 'Cities' })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  title: string;

  @ManyToOne(() => State, (state) => state.cities)
  state: State;

  @OneToMany(() => Listing, (listing) => listing.city)
  listings: Listing[];

  @OneToMany(() => Preference, (preference) => preference.city)
  preferences: Preference[];
}
