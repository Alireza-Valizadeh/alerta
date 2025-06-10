import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { notificationConstants } from './constants';
import { MyLoggerService } from '../core/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';
import { Preference } from '../preferences/preference.entity';
import { Listing } from '../listings/listing.entity';
import { CreditsService } from '../credits/credits.service';
import { TransactionType } from '../credits/credit-transactions.entity';
import { PersianTranslations } from '../common/enums/translations.enum';

@Injectable()
export class NotificationsService {
  private API_KEY: string;
  constructor(
    private readonly configService: ConfigService,
    private creditsService: CreditsService,
    private readonly logger: MyLoggerService,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {
    this.API_KEY = this.configService.get('NOTIF_API_KEY');
  }
  async sendAndSaveNotificationSms(
    preference: Preference,
    listing: Listing,
    text: string,
  ): Promise<Notification | null> {
    const user = preference.user;
    const phone = user.phone;
    const cost = await this.sendSms([phone], text);
    if (cost) {
      await this.creditsService.adjustCredits(
        user.id,
        cost * -1,
        PersianTranslations.GeneralStatements.NewSmsCost,
        TransactionType.USAGE,
        listing,
        preference,
      );
    }
    return await this.saveNotification(preference, listing, text, !!cost);
  }

  async sendVertificationCode(phone: string, code: string) {
    try {
      if (this.configService.get('NODE_ENV') === 'production') {
        const { apiUrl, verifySubUrl, templateId } = notificationConstants;
        const verifyUrl = apiUrl + verifySubUrl;
        const body = {
          Mobile: phone,
          TemplateId: templateId,
          Parameters: [{ name: 'code', value: code }],
        };
        const response = await axios.post(verifyUrl, body, {
          headers: {
            'x-api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        });
        this.logger.log({ response: response.data });
      }
      this.logger.log('sent Vertification Code', phone, code);
    } catch (error) {
      this.logger.error(
        error?.message,
        error?.stack,
        'NotificationsService.sendSandboxSms',
        { phone, code },
      );
    }
  }

  async findUserNotifications(uid: number): Promise<Notification[]> {
    try {
      const notifications = this.notificationRepository.find({
        where: { user: { id: uid } },
        order: { createdAt: 'DESC' },
        relations: ['preference', 'listing'],
      });
      return notifications;
    } catch (error) {
      this.logger.error(
        error?.message,
        error?.stack,
        'NotificationsService.findUserNotifications',
        { uid },
      );
      return [];
    }
  }

  private saveNotification(
    preference: Preference,
    listing: Listing,
    text: string,
    isSent: boolean,
  ): Promise<Notification | null> {
    try {
      const notification: Omit<Notification, 'id' | 'createdAt'> = {
        isSmsSent: isSent,
        text,
        smsSentAt: isSent ? new Date() : null,
        listing,
        preference,
        user: preference.user,
      };
      const notif = this.notificationRepository.create(notification);
      return this.notificationRepository.save(notif);
    } catch (error) {
      this.logger.error(
        error?.message,
        error?.stack,
        'NotificationsService.saveNotification',
        { preference },
      );
      return null;
    }
  }

  private async sendSms(
    phones: string[],
    text: string,
  ): Promise<number | null> {
    try {
      const { apiUrl, bulkSubUrl, lineNumber } = notificationConstants;
      const bulkUrl = apiUrl + bulkSubUrl;
      const response = await axios.post(
        bulkUrl,
        {
          lineNumber,
          MessageText: text,
          Mobiles: phones,
        },
        {
          headers: {
            'x-api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.log({ response: response.data });
      this.logger.log('sent Bulk Sms', phones, text);
      const data = response.data as any;
      return data?.data.cost;
    } catch (error) {
      this.logger.error(
        error?.message,
        error?.stack,
        'NotificationsService.sendSms',
        {
          phones,
          text,
        },
      );
      return null;
    }
  }
}
