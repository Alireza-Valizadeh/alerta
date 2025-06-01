import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreditTransaction } from './credit-transactions.entity';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}
  @Get('transactions')
  @UseGuards(AuthGuard)
  getCreditsTransactions(
    @Request() request,
  ): Promise<{ credits: CreditTransaction[]; balance: number }> {
    const uid = request.user.sub;
    return this.creditsService.getCreditsTransactions(uid);
  }
}
