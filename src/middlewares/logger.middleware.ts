import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: MyLoggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    this.logger.http(`---------------------------------------`);
    this.logger.http(`${method} ${originalUrl}`);
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || '0';

      this.logger.http(
        `Execution took ${contentLength}ms - Finished with Status: ${statusCode}`,
      );
    });
    next();
  }
}
