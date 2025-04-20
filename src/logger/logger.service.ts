import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import { inspect } from 'util';
@Injectable()
export class MyLoggerService implements LoggerService {
  private readonly logger = createLogger({
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message, context }) => {
        return `${timestamp} [${context || 'Nest'}] ${level.toUpperCase()}: ${message}`;
      }),
    ),
    transports: [
      new transports.File({
        filename: path.join('logs', 'errors.log.txt'),
        level: 'error',
      }),
      new transports.File({
        filename: path.join('logs', 'http.log.txt'),
        level: 'http',
      }),
      new transports.File({
        filename: path.join('logs', 'debug.log.txt'),
        level: 'debug',
      }),
      new transports.Console(),
    ],
  });

  private formatArgs(args: any[]): string {
    return args
      .map((arg) =>
        typeof arg === 'object' ? inspect(arg, { depth: null }) : arg,
      )
      .join(' ');
  }
  log(message: any, ...optionalParams: any[]) {
    this.logger.info(this.formatArgs([message, ...optionalParams]));
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(this.formatArgs([message, ...optionalParams]));
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(this.formatArgs([message, ...optionalParams]));
  }
  http(message: any, ...optionalParams: any[]) {
    this.logger.http(this.formatArgs([message, ...optionalParams]));
  }
}
