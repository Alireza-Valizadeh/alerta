import { Listing } from '../../listings/listing.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './city.entity';
import { Preference } from '../../preferences/preference.entity';

@Entity({ name: 'States' })
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  title: string;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];

  @OneToMany(() => Listing, (listing) => listing.state)
  listings: Listing[];

  @OneToMany(() => Preference, (preference) => preference.state)
  preferences: Preference[];
}
