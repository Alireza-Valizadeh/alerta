import { Listing } from '../../listings/listing.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from './model.entity';

@Entity({ name: 'Makes' })
export class Make {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  title: string;

  @OneToMany(() => Model, (model) => model.make)
  models: Model[];

  @OneToMany(() => Listing, (listing) => listing.make)
  listings: Listing[];
}
