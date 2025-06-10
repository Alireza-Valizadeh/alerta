import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyLoggerService } from './logger.service';
import { RedisService } from './redis.service';
import { LogErrorRepositoryService } from './log-error-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogError } from '../common/entities/log-error.entity';

@Global()
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([LogError])],
  providers: [RedisService, MyLoggerService, LogErrorRepositoryService],
  exports: [RedisService, MyLoggerService, LogErrorRepositoryService],
})
export class CoreModule {}
