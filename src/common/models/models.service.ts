import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from '../entities/model.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model)
    private modelsRepository: Repository<Model>,
  ) {}
  getMakeModels(makeId: number): Promise<Model[]> {
    return this.modelsRepository.findBy({
      make: { id: makeId },
    });
  }
}
