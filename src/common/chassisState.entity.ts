import { Listing } from '../listings/listing.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ChassisStates' })
export class ChassisState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  title: string;

  @OneToMany(() => Listing, (listing) => listing.chassisState)
  listings: Listing[];
}
