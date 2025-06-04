import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreditTransaction,
  TransactionType,
} from './credit-transactions.entity';
import { MyLoggerService } from '../core/logger.service';
import { UsersService } from '../users/users.service';
import { Listing } from '../listings/listing.entity';
import { Preference } from '../preferences/preference.entity';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(CreditTransaction)
    private creditTransactionsRepository: Repository<CreditTransaction>,
    private usersService: UsersService,
    private readonly logger: MyLoggerService,
  ) {}

  async adjustCredits(
    uid: number,
    amount: number,
    description: string,
    type: TransactionType,
    listing: Listing | null,
    preference: Preference | null,
  ): Promise<void> {
    const user = await this.usersService.findOneById(uid);
    const credit = this.creditTransactionsRepository.create({
      user,
      amount,
      description,
      balanceAfter: user.balance + amount,
      type,
      listing,
      preference,
    });
    await this.creditTransactionsRepository.save(credit, {
      transaction: true,
    });
    this.logger.log(
      `Credit added to user ${user.id}: $${credit.amount} Reason: ${description}`,
    );
    await this.usersService.updateUserBalance(user.id, credit.balanceAfter, {
      transaction: true,
    });
  }

  async getCreditsTransactions(
    uid: number,
  ): Promise<{ transactions: CreditTransaction[]; balance: number }> {
    const transactions = await this.creditTransactionsRepository.find({
      where: { user: { id: uid } },
      order: { createdAt: 'DESC' },
    });
    const user = await this.usersService.findOneById(uid);
    const balance = user.balance || 0;
    return { transactions, balance };
  }
}
