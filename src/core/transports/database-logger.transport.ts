import Transport from 'winston-transport';
import { LogErrorRepositoryService } from '../log-error-repository.service';
import { LogError } from '../../common/entities/log-error.entity';
interface DatabaseLoggerTransportOptions
  extends Transport.TransportStreamOptions {
  logErrorRepositoryService: LogErrorRepositoryService;
}

export class DatabaseLoggerTransport extends Transport {
  private logErrorRepositoryService: LogErrorRepositoryService;

  constructor(options: DatabaseLoggerTransportOptions) {
    super(options);
    this.logErrorRepositoryService = options.logErrorRepositoryService;
  }

  log(info: any, callback: () => void) {
    if (info.level === 'error') {
      const logEntry: Partial<LogError> = {
        level: info.level,
        context: info.context || null,
        message: info.message,
        stack: info.trace || info.stack || null,
        meta: info.meta || null,
        timestamp: new Date(),
      };

      this.logErrorRepositoryService
        .saveLog(logEntry)
        .then(() => {})
        .catch((error) => {
          console.error('Error saving log to database:', error);
        });
    }

    if (callback) {
      callback();
    }
  }
}
