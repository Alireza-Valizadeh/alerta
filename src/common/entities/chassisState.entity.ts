import { Preference } from '../../preferences/preference.entity';
import { Listing } from '../../listings/listing.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'ChassisStates' })
export class ChassisState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  title: string;

  @OneToMany(() => Listing, (listing) => listing.chassisState)
  listings: Listing[];

  @ManyToMany(() => Preference, (preference) => preference.chassisStates)
  preferences: Preference[];
}
