import { Listing } from '../listings/listing.entity';
import { Preference } from '../preferences/preference.entity';
import { User } from '../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  text: string;

  @Column({ type: 'boolean', default: false })
  isSmsSent: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  smsSentAt: Date | null;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @ManyToOne(() => Preference, (preference) => preference.notifications)
  preference: Preference;

  @ManyToOne(() => Listing, (listing) => listing.notifications)
  listing: Listing;
}
