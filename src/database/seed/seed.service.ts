import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { BodyState } from '../../common/entities/bodyState.entity';
import { ChassisState } from '../../common/entities/chassisState.entity';
import { City } from '../../common/entities/city.entity';
import { Color } from '../../common/entities/color.entity';
import { EngineState } from '../../common/entities/engineState.entity';
import { FuelType } from '../../common/entities/fuelType.entity';
import { Gearbox } from '../../common/entities/gearbox.entity';
import { Make } from '../../common/entities/make.entity';
import { Model } from '../../common/entities/model.entity';
import { State } from '../../common/entities/state.entity';
import { Repository } from 'typeorm';
import { MyLoggerService } from '../../core/logger.service';
import { PersianTranslations } from '../../common/enums/translations.enum';
import * as IranStates from './provinces.json';
import * as IranCities from './cities.json';
import * as Makes from './makes.json';
import * as Models from './models.json';
import * as Users from './users.json';
import { RedisService } from '../../core/redis.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly logger: MyLoggerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Make)
    private readonly makeRepository: Repository<Make>,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Gearbox)
    private readonly gearboxRepository: Repository<Gearbox>,
    @InjectRepository(FuelType)
    private readonly fuelTypeRepository: Repository<FuelType>,
    @InjectRepository(EngineState)
    private readonly engineStateRepository: Repository<EngineState>,
    @InjectRepository(ChassisState)
    private readonly chassisStateRepository: Repository<ChassisState>,
    @InjectRepository(BodyState)
    private readonly bodyStateRepository: Repository<BodyState>,
    private redisService: RedisService,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
    await this.seedBodyStates();
    await this.seedGearboxes();
    await this.seedColors();
    await this.seedFuelTypes();
    await this.seedEngineStates();
    await this.seedChassisStates();
    await this.seedStatesAndCities();
    await this.seedMakesAndModels();
  }

  async seedUsers() {
    const existingUsers = await this.userRepository.count();
    this.logger.log('Existing Users', existingUsers);
    if (existingUsers === 0) {
      const usersToSeed = Array.from(Users);
      await this.userRepository.save(usersToSeed);
    }
  }

  async seedBodyStates() {
    const existingBodyStates = await this.bodyStateRepository.count();
    this.logger.log('Existing body states', existingBodyStates);
    if (existingBodyStates === 0) {
      const bodyStatesToSeed = Object.values(
        PersianTranslations.BodyStates || {},
      ).map((value) => ({ title: value }));
      await this.bodyStateRepository.save(bodyStatesToSeed);
    }
    const allBodyStates = await this.bodyStateRepository.find();
    this.cacheLookupMap('bodyStates', allBodyStates);
  }

  async seedGearboxes() {
    const existingGearboxes = await this.gearboxRepository.count();
    this.logger.log('Existing Gearboxes', existingGearboxes);
    if (existingGearboxes === 0) {
      const gearboxesToSeed = Object.values(
        PersianTranslations.Gearboxes || {},
      ).map((value) => ({ title: value }));
      await this.gearboxRepository.save(gearboxesToSeed);
    }
    const allGearboxes = await this.gearboxRepository.find();
    this.cacheLookupMap('gearboxes', allGearboxes);
  }

  async seedColors() {
    const existingColors = await this.colorRepository.count();
    this.logger.log('Existing Colors', existingColors);
    if (existingColors === 0) {
      const colorsToSeed = Object.values(PersianTranslations.Colors || {}).map(
        (value) => ({ title: value }),
      );
      await this.colorRepository.save(colorsToSeed);
    }
    const allColors = await this.colorRepository.find();
    await this.cacheLookupMap('colors', allColors);
  }

  async seedFuelTypes() {
    const existingFuelTypes = await this.fuelTypeRepository.count();
    this.logger.log('Existing Fuel Types', existingFuelTypes);
    if (existingFuelTypes === 0) {
      const fuelTypesToSeed = Object.values(
        PersianTranslations.FuelTypes || {},
      ).map((value) => ({ title: value }));
      await this.fuelTypeRepository.save(fuelTypesToSeed);
    }
    const allFuelTypes = await this.fuelTypeRepository.find();
    this.cacheLookupMap('fuelTypes', allFuelTypes);
  }

  async seedEngineStates() {
    const existingEngineStates = await this.engineStateRepository.count();
    this.logger.log('Existing Engine States', existingEngineStates);
    if (existingEngineStates === 0) {
      const engineStatesToSeed = Object.values(
        PersianTranslations.EngineStates || {},
      ).map((value) => ({ title: value }));
      await this.engineStateRepository.save(engineStatesToSeed);
    }
    const allEngineStates = await this.engineStateRepository.find();
    this.cacheLookupMap('engineStates', allEngineStates);
  }

  async seedChassisStates() {
    const existingChassisStates = await this.chassisStateRepository.count();
    this.logger.log('Existing Chassis States', existingChassisStates);
    if (existingChassisStates === 0) {
      const chassisStatesToSeed = Object.values(
        PersianTranslations.ChassisStates || {},
      ).map((value) => ({ title: value }));
      await this.chassisStateRepository.save(chassisStatesToSeed);
    }
    const allChassisStates = await this.chassisStateRepository.find();
    this.cacheLookupMap('chassisStates', allChassisStates);
  }

  async seedStatesAndCities() {
    const existingStates = await this.stateRepository.count();
    const existingCities = await this.cityRepository.count();

    this.logger.log('Existing States', existingStates);
    this.logger.log('Existing Cities', existingCities);

    if (existingStates === 0 && existingCities === 0) {
      this.logger.log('Adding States and Cities');
      const stateEntities = Array.from(IranStates)?.map((stateData) => ({
        title: stateData.title,
      }));
      const savedStates = await this.stateRepository.save(stateEntities);
      const citiesToSeed = Array.from(IranCities)?.map((cityData) => {
        const state = savedStates.find(
          (state) => state.title === cityData.provinceTitle,
        ) as State;
        return {
          title: cityData.title,
          state: state,
        };
      });
      await this.cityRepository.save(citiesToSeed);
    }
    const allStates = await this.stateRepository.find();
    this.cacheLookupMap('states', allStates);
    const allCities = await this.cityRepository.find();
    this.cacheLookupMap('cities', allCities);
  }
  async seedMakesAndModels() {
    const existingMakes = await this.makeRepository.count();
    const existingModels = await this.modelRepository.count();
    this.logger.log('Existing Makes', existingMakes);
    this.logger.log('Existing Models', existingModels);

    if (existingMakes === 0 && existingModels === 0) {
      this.logger.log('Adding Makes and Models');
      const makesToSeed = Array.from(Makes);
      const savedMakes = await this.makeRepository.save(makesToSeed);
      const modelsToSeed = Array.from(Models)?.map((modelData) => {
        const make = savedMakes.find(
          (make) => make.title === modelData.makeTitle,
        ) as Make;
        return {
          title: modelData.title,
          make: make,
        };
      });
      await this.modelRepository.save(modelsToSeed);
    }
    const allMakes = await this.makeRepository.find();
    this.cacheLookupMap('makes', allMakes);
    const allModels = await this.modelRepository.find();
    this.cacheLookupMap('models', allModels);
  }

  private async cacheLookupMap(
    key: string,
    items: { id: number; title: string }[],
  ) {
    const map = Object.fromEntries(items.map((item) => [item.id, item.title]));
    await this.redisService.set(`lookup:${key}`, JSON.stringify(map));
  }
}
