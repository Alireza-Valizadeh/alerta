import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}
  getStateCities(stateId: number): Promise<City[]> {
    return this.citiesRepository.findBy({
      state: { id: stateId },
    });
  }
}
