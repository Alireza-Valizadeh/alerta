import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { MyLoggerService } from './logger.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Redis;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: MyLoggerService,
  ) {
    const host = this.configService.get('REDIS_HOST');
    const port = this.configService.get('REDIS_PORT');
    const password = this.configService.get('REDIS_PASSWORD');

    this.client = new Redis({
      host,
      port,
      password,
      lazyConnect: true,
    });
  }

  async onModuleInit() {
    this.logger.log('REDIS_HOST');
    // await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(key: string, value: string, seconds?: number): Promise<void> {
    try {
      if (seconds) {
        await this.client.set(key, value, 'EX', seconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.log('Redis SET error', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.log('Redis GET error', error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
      throw error;
    }
  }
}
