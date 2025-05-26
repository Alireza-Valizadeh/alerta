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

@Injectable()
export class NotificationsService {
  private API_KEY: string;
  constructor(
    private readonly configService: ConfigService,
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
    const isSent = await this.sendBulkSms([phone], text);
    return await this.saveNotification(preference, listing, text, isSent);
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
      this.logger.error('sendSandboxSms error', error);
    }
  }

  async findUserNotifications(uid: number): Promise<Notification[]> {
    try {
      const notifications = this.notificationRepository.find({
        where: { user: { id: uid } },
        relations: ['preference', 'listing'],
      });
      return notifications;
    } catch (error) {
      this.logger.error('findUserNotifications error', error);
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
      this.logger.error('saveNotification error', error);
      return null;
    }
  }

  private async sendBulkSms(phones: string[], text: string): Promise<boolean> {
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
      return true;
    } catch (error) {
      this.logger.error('sendBulkSms error', error);
      return false;
    }
  }
}
