// src/credits/credit-transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from '../listings/listing.entity';
import { Preference } from '../preferences/preference.entity';

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  USAGE = 'USAGE',
  BONUS = 'BONUS',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity({ name: 'credit_transactions' })
export class CreditTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.creditTransactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'integer' })
  amount: number;

  @Column({ type: 'bigint' })
  balanceAfter: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Listing, (listing) => listing.creditTransactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'listingId' })
  listing: Listing | null;

  @ManyToOne(() => Preference, (preference) => preference.creditTransactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'preferenceId' })
  preference: Preference | null;
}
