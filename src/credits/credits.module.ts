import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditTransaction } from './credit-transactions.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([CreditTransaction])],
  providers: [CreditsService],
  controllers: [CreditsController],
})
export class CreditsModule {}
