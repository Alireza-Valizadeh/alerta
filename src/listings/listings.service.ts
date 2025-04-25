import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { Repository } from 'typeorm';
import { Listing } from './listing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Gearbox } from '../common/entities/gearbox.entity';
import { BodyState } from '../common/entities/bodyState.entity';
import { ChassisState } from '../common/entities/chassisState.entity';
import { City } from '../common/entities/city.entity';
import { Color } from '../common/entities/color.entity';
import { EngineState } from '../common/entities/engineState.entity';
import { FuelType } from '../common/entities/fuelType.entity';
import { Make } from '../common/entities/make.entity';
import { Model } from '../common/entities/model.entity';
import { State } from '../common/entities/state.entity';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    @InjectRepository(Gearbox)
    private gearboxesRepository: Repository<Gearbox>,
    @InjectRepository(BodyState)
    private bodyStatesRepository: Repository<BodyState>,
    @InjectRepository(ChassisState)
    private chassisStatesRepository: Repository<ChassisState>,
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
    @InjectRepository(Color)
    private colorsRepository: Repository<Color>,
    @InjectRepository(EngineState)
    private engineStatesRepository: Repository<EngineState>,
    @InjectRepository(FuelType)
    private fuelTypesRepository: Repository<FuelType>,
    @InjectRepository(Make)
    private makesRepository: Repository<Make>,
    @InjectRepository(Model)
    private modelsRepository: Repository<Model>,
    @InjectRepository(State)
    private statesRepository: Repository<Gearbox>,
  ) {}
  async addListing(createListingDto: CreateListingDto): Promise<Listing> {
    const gearbox = await this.gearboxesRepository.findOneBy({
      id: createListingDto.gearboxId,
    });
    const bodyState = await this.bodyStatesRepository.findOneBy({
      id: createListingDto.bodyStateId,
    });
    const chassisState = await this.chassisStatesRepository.findOneBy({
      id: createListingDto.chassisStateId,
    });
    const city = await this.citiesRepository.findOneBy({
      id: createListingDto.cityId,
    });
    const color = await this.colorsRepository.findOneBy({
      id: createListingDto.colorId,
    });
    const engineState = await this.engineStatesRepository.findOneBy({
      id: createListingDto.engineStateId,
    });
    const fuelType = await this.fuelTypesRepository.findOneBy({
      id: createListingDto.fuelTypeId,
    });
    const make = await this.makesRepository.findOneBy({
      id: createListingDto.makeId,
    });
    const model = await this.modelsRepository.findOneBy({
      id: createListingDto.modelId,
    });
    const state = await this.statesRepository.findOneBy({
      id: createListingDto.stateId,
    });
    const listing = this.listingsRepository.create({
      ...createListingDto,
      gearbox,
      bodyState,
      chassisState,
      city,
      color,
      engineState,
      fuelType,
      make,
      model,
      state,
    });
    return this.listingsRepository.save(listing);
  }
  async getListingById(id: number): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: [
        'make',
        'model',
        'color',
        'state',
        'city',
        'gearbox',
        'fuelType',
        'engineState',
        'chassisState',
        'bodyState',
      ],
    });
    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }
    return listing;
  }
}
