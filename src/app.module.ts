import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { PreferencesModule } from './preferences/preferences.module';
import { ListingsModule } from './listings/listings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { RedisService } from './core/redis.service';
import { CoreModule } from './core/core.module';
import { CreditsModule } from './credits/credits.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        migrationsRun: true,
        migrations: ['src/database/migrations/*.ts'],
        // synchronize: configService.get('NODE_ENV') !== 'production',
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PreferencesModule,
    ListingsModule,
    NotificationsModule,
    CommonModule,
    DatabaseModule,
    CoreModule,
    CreditsModule,
    TemplatesModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
