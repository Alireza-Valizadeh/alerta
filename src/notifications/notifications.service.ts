import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { notificationConstants } from './constants';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: MyLoggerService,
  ) {}
  async sendBulkSms(phones: string[], text: string) {
    try {
      // const apiKey = this.configService.get(`NOTIF_API_KEY`);
      const apiKey = 'icNdObA8eqHCbcUWf87z8qsuBfoooO2ZWxx4BL3mNQ6Qncqe';
      const { apiUrl, bulkSubUrl, lineNumber } = notificationConstants;
      this.logger.log('apiKey', apiKey);
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
            'x-api-key': apiKey,
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

  async sendSandboxSms(phone: string, text: string) {
    try {
      // const apiKey = this.configService.get('NOTIF_API_KEY');
      // const { apiUrl, username, line } = notificationConstants;
      // const url = `${apiUrl}?username=${username}&line=${line}&apikey=${apiKey}&mobile=${phone}&text=${text}`;
      // return fetch(url);
      this.logger.log('sent Sandbox Sms', phone, text);
    } catch (error) {
      this.logger.error('sendSandboxSms error', error);
    }
  }
}
