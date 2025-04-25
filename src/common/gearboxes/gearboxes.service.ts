import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gearbox } from '../entities/gearbox.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GearboxesService {
  constructor(
    @InjectRepository(Gearbox)
    private gearboxesRepository: Repository<Gearbox>,
  ) {}
  createGearbox(title: string): Promise<Gearbox> {
    const newGearbox = this.gearboxesRepository.create({ title });
    return this.gearboxesRepository.save(newGearbox);
  }
  async updateGearbox(id: number, title: string): Promise<boolean> {
    await this.gearboxesRepository.update(id, { title });
    return true;
  }
}
