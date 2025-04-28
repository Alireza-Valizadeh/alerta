import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelType } from '../entities/fuelType.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FuelTypesService {
  constructor(
    @InjectRepository(FuelType)
    private fuelTypesRepository: Repository<FuelType>,
  ) {}
  getFuelTypes(): Promise<FuelType[]> {
    return this.fuelTypesRepository.find();
  }
}
