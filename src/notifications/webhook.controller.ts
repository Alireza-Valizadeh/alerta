import { Controller, Get } from '@nestjs/common';

@Controller('notifications/webhooks')
export class WebhookController {
  constructor() {}

  @Get('register')
  register() {
    return 'ok';
  }
}
