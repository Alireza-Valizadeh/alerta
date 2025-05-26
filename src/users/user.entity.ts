import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from './enums/genders.enum';
import { Listing } from '../listings/listing.entity';
import { Preference } from '../preferences/preference.entity';
import { Notification } from '../notifications/notification.entity';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.NOT_SPECIFIED })
  gender: Gender;

  @Column({ type: 'boolean', default: false })
  isAbandoned: boolean;

  @Column({ type: 'varchar', unique: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @OneToMany(() => Listing, (listing) => listing.user)
  listings: Listing[];

  @OneToMany(() => Preference, (preference) => preference.user)
  preferences: Preference[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
