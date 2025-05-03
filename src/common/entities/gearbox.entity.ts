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

@Entity({ name: 'Gearboxes' })
export class Gearbox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  title: string;

  @OneToMany(() => Listing, (listing) => listing.gearbox)
  listings: Listing[];

  @ManyToMany(() => Preference, (preference) => preference.gearboxes)
  @JoinTable({
    name: 'preference_gearboxes',
    joinColumn: { name: 'gearboxId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'preferenceId', referencedColumnName: 'id' },
  })
  preferences: Preference[];
}
