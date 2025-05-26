import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}
  @Get()
  @UseGuards(AuthGuard)
  getUserNotifications(@Request() request) {
    const uid = request.user.sub;
    return this.notificationsService.findUserNotifications(uid);
  }
}
