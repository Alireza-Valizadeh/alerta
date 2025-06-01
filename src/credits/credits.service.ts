import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreditTransaction,
  TransactionType,
} from './credit-transactions.entity';
import { MyLoggerService } from '../core/logger.service';
import { UsersService } from '../users/users.service';

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
    relatedListingId: number | null,
  ): Promise<void> {
    const user = await this.usersService.findOneById(uid);
    const credit = this.creditTransactionsRepository.create({
      user,
      amount,
      description,
      balanceAfter: user.balance + amount,
      type,
      relatedListingId,
    });
    await this.creditTransactionsRepository.save(credit);
    this.logger.log(
      `Credit added to user ${user.id}: $${credit} Reason: ${description}`,
    );
  }

  async getCreditsTransactions(
    uid: number,
  ): Promise<{ credits: CreditTransaction[]; balance: number }> {
    const credits = await this.creditTransactionsRepository.find({
      where: { user: { id: uid } },
      order: { createdAt: 'DESC' },
    });
    const user = await this.usersService.findOneById(uid);
    const balance = user.balance || 0;
    return { credits, balance };
  }
}
