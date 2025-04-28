import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './listing.entity';
import { CommonModule } from '../common/common.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CommonModule, UsersModule, TypeOrmModule.forFeature([Listing])],
  providers: [ListingsService],
  controllers: [ListingsController],
})
export class ListingsModule {}
