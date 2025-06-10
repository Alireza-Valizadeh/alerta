import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import * as path from 'path';
import { inspect } from 'util';
import { LogErrorRepositoryService } from './log-error-repository.service';
import { DatabaseLoggerTransport } from './transports/database-logger.transport';
@Injectable()
export class MyLoggerService implements LoggerService {
  private logger: Logger = createLogger({
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message, context }) => {
        return `${timestamp} [${context || 'Nest'}] ${level.toUpperCase()}: ${message}`;
      }),
    ),
    transports: [
      new DatabaseLoggerTransport({
        logErrorRepositoryService: this.logErrorRepositoryService,
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
      new transports.Console({
        level: 'debug',
      }),
    ],
  });

  constructor(
    private readonly logErrorRepositoryService: LogErrorRepositoryService,
  ) {}

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
  error(message: string, trace?: string, context?: string, meta?: object) {
    this.logger.error(message, { context, trace, meta });
  }
  http(message: any, ...optionalParams: any[]) {
    this.logger.http(this.formatArgs([message, ...optionalParams]));
  }
}
