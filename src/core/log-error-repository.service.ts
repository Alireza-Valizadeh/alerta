import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogError } from '../common/entities/log-error.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogErrorRepositoryService {
  constructor(
    @InjectRepository(LogError)
    private readonly logErrorRepository: Repository<LogError>,
  ) {}

  async saveLog(logEntry: Partial<LogError>): Promise<LogError> {
    const newLog = this.logErrorRepository.create(logEntry);
    return this.logErrorRepository.save(newLog);
  }
}
