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

@Entity({ name: 'BodyStates' })
export class BodyState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  title: string;

  @OneToMany(() => Listing, (listing) => listing.bodyState)
  listings: Listing[];

  @ManyToMany(() => Preference, (preference) => preference.bodyStates)
  @JoinTable({
    name: 'preference_bodyStates',
    joinColumn: { name: 'bodyStateId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'preferenceId', referencedColumnName: 'id' },
  })
  preferences: Preference[];
}
