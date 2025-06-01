import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { CreditsModule } from '../credits/credits.module';

@Module({
  imports: [CreditsModule, TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController, WebhookController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
