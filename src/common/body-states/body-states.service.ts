import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BodyState } from '../entities/bodyState.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BodyStatesService {
  constructor(
    @InjectRepository(BodyState)
    private bodyStatesRepository: Repository<BodyState>,
  ) {}
  createBodyState(title: string): Promise<BodyState> {
    const newBs = this.bodyStatesRepository.create({ title });
    return this.bodyStatesRepository.save(newBs);
  }
  async updateGearbox(id: number, title: string): Promise<boolean> {
    await this.bodyStatesRepository.update(id, { title });
    return true;
  }
}
