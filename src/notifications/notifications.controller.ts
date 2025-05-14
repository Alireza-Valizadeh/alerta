import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}
  @Get('test')
  test() {
    return this.notificationsService.sendVertificationCode(
      '09151244265',
      '2667',
    );
  }
}
