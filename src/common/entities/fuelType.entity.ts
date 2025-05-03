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

@Entity({ name: 'FuelTypes' })
export class FuelType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  title: string;

  @OneToMany(() => Listing, (listing) => listing.fuelType)
  listings: Listing[];

  @ManyToMany(() => Preference, (preference) => preference.fuelTypes)
  @JoinTable({
    name: 'preference_fuelTypes',
    joinColumn: { name: 'fuelTypeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'preferenceId', referencedColumnName: 'id' },
  })
  preferences: Preference[];
}
