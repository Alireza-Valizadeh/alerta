import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { MyLoggerService } from '../../logger/logger.service';
import { PersianTranslations } from '../../common/enums/translations.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly logger: MyLoggerService,
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
  ) {}

  async onModuleInit() {
    await this.seedBodyStates();
    await this.seedGearboxes();
    await this.seedColors();
    await this.seedFuelTypes();
    await this.seedEngineStates();
    await this.seedChassisStates();
    // await this.seedModels();
    // await this.seedStates();
    // await this.seedCities();
  }

  async seedBodyStates() {
    const existingBodyStates = await this.bodyStateRepository.count();
    this.logger.log('Existing body states', existingBodyStates);
    if (existingBodyStates === 0) {
      const bodyStatesToSeed = [
        { title: 'سالم و بی خط و خش' },
        { title: 'خط و خش جزیی' },
        { title: 'یک تکه رنگ' },
        { title: 'دو  تکه رنگ' },
        { title: 'چند تکه رنگ' },
        { title: 'بدون رنگ' },
        { title: 'تمام رنگ' },
      ];
      await this.bodyStateRepository.save(bodyStatesToSeed);
    }
  }

  async seedGearboxes() {
    const existingGearboxes = await this.gearboxRepository.count();
    this.logger.log('Existing Gearboxes', existingGearboxes);
    if (existingGearboxes === 0) {
      const gearboxesToSeed = [{ title: 'دنده ای' }, { title: 'اتوماتیک' }];
      await this.gearboxRepository.save(gearboxesToSeed);
    }
  }

  async seedColors() {
    const existingColors = await this.colorRepository.count();
    this.logger.log('Existing Colors', existingColors);
    if (existingColors === 0) {
      const colorsToSeed = [
        { title: 'سبز' },
        { title: 'قرمز' },
        { title: 'زرد' },
        { title: 'آبی' },
        { title: 'نارنجی' },
        { title: 'نوک مدادی' },
        { title: 'دلفینی' },
        { title: 'مشکی' },
        { title: 'سفید' },
        { title: 'آلبایویی' },
        { title: 'نقره ای' },
        { title: 'سفید صدفی' },
        { title: 'آبی آسمانی' },
      ];
      await this.colorRepository.save(colorsToSeed);
    }
  }

  async seedFuelTypes() {
    const existingFuelTypes = await this.fuelTypeRepository.count();
    this.logger.log('Existing Fuel Types', existingFuelTypes);
    if (existingFuelTypes === 0) {
      const fuelTypesToSeed = [
        { title: 'دیزل' },
        { title: 'بنزینی' },
        { title: 'برقی' },
        { title: 'هیبرید' },
        { title: 'دوگانه دستی' },
        { title: 'دوگانه کارخانه' },
      ];
      await this.fuelTypeRepository.save(fuelTypesToSeed);
    }
  }

  async seedEngineStates() {
    const existingEngineStates = await this.engineStateRepository.count();
    this.logger.log('Existing Engine States', existingEngineStates);
    if (existingEngineStates === 0) {
      const engineStatesToSeed = [
        { title: 'سالم' },
        { title: 'نیاز به تعمیر' },
        { title: 'تعویض شده' },
      ];
      await this.engineStateRepository.save(engineStatesToSeed);
    }
  }

  async seedChassisStates() {
    const existingChassisStates = await this.chassisStateRepository.count();
    this.logger.log('Existing Chassis States', existingChassisStates);
    if (existingChassisStates === 0) {
      const chassisStatesToSeed = Object.values(
        PersianTranslations.ChassisState || {},
      ).map((value) => ({ title: value }));
      await this.chassisStateRepository.save(chassisStatesToSeed);
    }
  }
}
