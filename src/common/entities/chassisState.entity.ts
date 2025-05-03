import { Preference } from '../../preferences/preference.entity';
import { Listing } from '../../listings/listing.entity';
import {
  Column,
  Entity,
  JoinTable,
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
  @JoinTable({
    name: 'preference_chassisStates',
    joinColumn: { name: 'chassisStateId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'preferenceId', referencedColumnName: 'id' },
  })
  preferences: Preference[];
}
