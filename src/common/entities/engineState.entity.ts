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

@Entity({ name: 'EngineStates' })
export class EngineState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  title: string;

  @OneToMany(() => Listing, (listing) => listing.engineState)
  listings: Listing[];

  @ManyToMany(() => Preference, (preference) => preference.engineStates)
  @JoinTable({
    name: 'preference_engineStates',
    joinColumn: { name: 'engineStateId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'preferenceId', referencedColumnName: 'id' },
  })
  preferences: Preference[];
}
