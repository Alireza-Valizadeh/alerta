import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyLoggerService } from './logger.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService, MyLoggerService],
  exports: [RedisService, MyLoggerService],
})
export class CoreModule {}
