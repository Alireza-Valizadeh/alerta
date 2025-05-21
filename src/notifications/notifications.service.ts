import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { notificationConstants } from './constants';
import { MyLoggerService } from '../core/logger.service';

@Injectable()
export class NotificationsService {
  private API_KEY: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: MyLoggerService,
  ) {
    this.API_KEY = this.configService.get('NOTIF_API_KEY');
  }
  async sendBulkSms(phones: string[], text: string) {
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
    } catch (error) {
      this.logger.error('sendBulkSms error', error);
    }
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
}
