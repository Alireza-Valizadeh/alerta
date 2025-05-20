import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Preference } from './preference.entity';
import { In, Repository } from 'typeorm';
import { CreatePreferenceDto, UpdatePreferenceDto } from './dto/preference.dto';
import { BodyState } from '../common/entities/bodyState.entity';
import { ChassisState } from '../common/entities/chassisState.entity';
import { City } from '../common/entities/city.entity';
import { Color } from '../common/entities/color.entity';
import { EngineState } from '../common/entities/engineState.entity';
import { FuelType } from '../common/entities/fuelType.entity';
import { Gearbox } from '../common/entities/gearbox.entity';
import { Make } from '../common/entities/make.entity';
import { Model } from '../common/entities/model.entity';
import { State } from '../common/entities/state.entity';
import { User } from '../users/user.entity';
import { MyLoggerService } from '../core/logger.service';
import { Listing } from '../listings/listing.entity';

@Injectable()
export class PreferencesService {
  private relations: string[];
  constructor(
    @InjectRepository(Preference)
    private readonly preferenceRepository: Repository<Preference>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    private statesRepository: Repository<State>,
    private logger: MyLoggerService,
  ) {
    this.relations = [
      'user',
      'make',
      'model',
      'state',
      'city',
      'colors',
      'gearboxes',
      'bodyStates',
      'chassisStates',
      'engineStates',
      'fuelTypes',
    ];
  }

  async create(
    uid: number,
    createPreferenceDto: CreatePreferenceDto,
  ): Promise<Preference> {
    this.logger.log('Creating preference', createPreferenceDto);

    const user = await this.usersRepository.findOneBy({
      id: uid,
    });
    const state = await this.statesRepository.findOneBy({
      id: createPreferenceDto.stateId,
    });
    const city = await this.citiesRepository.findOneBy({
      id: createPreferenceDto.cityId,
    });
    const make = await this.makesRepository.findOneBy({
      id: createPreferenceDto.makeId,
    });
    const model = await this.modelsRepository.findOneBy({
      id: createPreferenceDto.modelId,
    });
    const colors = await this.findEntitiesByIds<Color>(
      this.colorsRepository,
      createPreferenceDto.colorIds,
    );
    const gearboxes = await this.findEntitiesByIds<Gearbox>(
      this.gearboxesRepository,
      createPreferenceDto.gearboxIds,
    );
    const fuelTypes = await this.findEntitiesByIds<FuelType>(
      this.fuelTypesRepository,
      createPreferenceDto.fuelTypeIds,
    );
    const engineStates = await this.findEntitiesByIds<EngineState>(
      this.engineStatesRepository,
      createPreferenceDto.engineStateIds,
    );
    const chassisStates = await this.findEntitiesByIds<ChassisState>(
      this.chassisStatesRepository,
      createPreferenceDto.chassisStateIds,
    );
    const bodyStates = await this.findEntitiesByIds<BodyState>(
      this.bodyStatesRepository,
      createPreferenceDto.bodyStateIds,
    );
    const preference = this.preferenceRepository.create({
      ...createPreferenceDto,
      user,
      state,
      city,
      make,
      model,
      colors,
      gearboxes,
      fuelTypes,
      engineStates,
      chassisStates,
      bodyStates,
    });
    return this.preferenceRepository.save(preference);
  }

  async findAll(uid: number): Promise<Preference[]> {
    return this.preferenceRepository.find({
      relations: this.relations,
      where: { user: { id: uid } },
    });
  }

  async findOne(id: number): Promise<Preference | null> {
    const preference = await this.preferenceRepository.findOne({
      where: { id },
      relations: this.relations,
    });
    return preference as Preference | null;
  }

  async update(
    uid: number,
    id: number,
    updatePreferenceDto: UpdatePreferenceDto,
  ): Promise<Preference | null> {
    this.logger.log('Updating preference', { id }, { updatePreferenceDto });
    const existingPreference = await this.preferenceRepository.findOne({
      where: { id },
      relations: this.relations,
    });
    if (!existingPreference) {
      throw new NotFoundException(`Preference with ID ${id} not found`);
    }
    Object.assign(existingPreference, updatePreferenceDto);

    if (existingPreference.user.id !== uid) {
      throw new ForbiddenException(
        'You are not authorized to update this preference',
      );
    }
    if (updatePreferenceDto.makeId) {
      existingPreference.make = await this.makesRepository.findOneBy({
        id: updatePreferenceDto.makeId,
      });
    }
    if (updatePreferenceDto.modelId) {
      existingPreference.model = await this.modelsRepository.findOneBy({
        id: updatePreferenceDto.modelId,
      });
    }
    if (updatePreferenceDto.stateId) {
      existingPreference.state = await this.statesRepository.findOneBy({
        id: updatePreferenceDto.stateId,
      });
    }
    if (updatePreferenceDto.cityId) {
      existingPreference.city = await this.citiesRepository.findOneBy({
        id: updatePreferenceDto.cityId,
      });
    }
    if (updatePreferenceDto.colorIds) {
      this.logger.log('#1 Finding colors', existingPreference.colors);
      existingPreference.colors = await this.colorsRepository.findBy({
        id: In(updatePreferenceDto.colorIds),
      });
      this.logger.log('#2 Finding colors', existingPreference.colors);
    }
    if (updatePreferenceDto.gearboxIds) {
      existingPreference.gearboxes = await this.gearboxesRepository.findBy({
        id: In(updatePreferenceDto.gearboxIds),
      });
    }
    if (updatePreferenceDto.fuelTypeIds) {
      existingPreference.fuelTypes = await this.fuelTypesRepository.findBy({
        id: In(updatePreferenceDto.fuelTypeIds),
      });
    }
    if (updatePreferenceDto.engineStateIds) {
      existingPreference.engineStates =
        await this.engineStatesRepository.findBy({
          id: In(updatePreferenceDto.engineStateIds),
        });
    }
    if (updatePreferenceDto.chassisStateIds) {
      existingPreference.chassisStates =
        await this.chassisStatesRepository.findBy({
          id: In(updatePreferenceDto.chassisStateIds),
        });
    }
    if (updatePreferenceDto.bodyStateIds) {
      existingPreference.bodyStates = await this.bodyStatesRepository.findBy({
        id: In(updatePreferenceDto.bodyStateIds),
      });
    }
    await this.preferenceRepository.save(existingPreference);
    return this.findOne(id);
  }

  async delete(uid: number, id: number): Promise<Preference> {
    this.logger.log('Deleting preference', id);
    const preference = await this.preferenceRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!preference) {
      throw new NotFoundException(`Preference with ID ${id} not found`);
    }
    if (preference.user.id !== uid) {
      throw new ForbiddenException(
        'You are not authorized to delete this preference',
      );
    }
    await this.preferenceRepository.softDelete(id);
    return preference;
  }

  async findMatchingPreferences(carListing: Listing): Promise<Preference[]> {
    const queryBuilder = this.preferenceRepository
      .createQueryBuilder('preference')
      .leftJoinAndSelect('preference.user', 'user')
      .leftJoin('preference.colors', 'color')
      .leftJoin('preference.gearboxes', 'gearbox')
      .leftJoin('preference.fuelTypes', 'fuelType')
      .leftJoin('preference.engineStates', 'engineState')
      .leftJoin('preference.chassisStates', 'chassisState')
      .leftJoin('preference.bodyStates', 'bodyState')
      .where('preference.stateId=:stateId', { stateId: carListing.state.id })
      .andWhere('preference.cityId=:cityId', { cityId: carListing.city.id })
      .andWhere('preference.makeId=:makeId', { makeId: carListing.make.id })
      .andWhere('preference.modelId=:modelId', { modelId: carListing.model.id })
      .andWhere(
        '(preference.minPrice IS NULL OR :price >= preference.minPrice) AND (preference.maxPrice IS NULL OR :price <= preference.maxPrice)',
        { price: carListing.price },
      )
      .andWhere(
        '(preference.minYear IS NULL OR :year >= preference.minYear) AND (preference.maxYear IS NULL OR :year <= preference.maxYear)',
        { year: carListing.year },
      )
      .andWhere(
        '(preference.minMileage IS NULL OR :mileage >= preference.minMileage) AND (preference.maxMileage IS NULL OR :mileage <= preference.maxMileage)',
        { mileage: carListing.mileage },
      )
      .andWhere(
        '(preference.minInsuranceDuration IS NULL OR :insuranceDuration >= preference.minInsuranceDuration) AND (preference.maxInsuranceDuration IS NULL OR :insuranceDuration <= preference.maxInsuranceDuration)',
        { insuranceDuration: carListing.insuranceDuration },
      )
      .andWhere(
        `(color.id IN (:...colorIds) OR NOT EXISTS (
          SELECT 1 FROM "preference_colors" pc
          WHERE pc."preferenceId" = preference.id
        ))`,
        { colorIds: [carListing.color.id] },
      )
      .andWhere(
        `(gearbox.id IN (:...gearboxIds) OR NOT EXISTS (
          SELECT 1 FROM "preference_gearboxes" pg
          WHERE pg."preferenceId" = preference.id
      ))`,
        { gearboxIds: [carListing.gearbox.id] },
      )
      .andWhere(
        `(fuelType.id IN (:...fuelTypeIds) OR NOT EXISTS (
          SELECT 1 FROM "preference_fuelTypes" pft
          WHERE pft."preferenceId" = preference.id
      ))`,
        { fuelTypeIds: [carListing.fuelType.id] },
      )
      .andWhere(
        `(engineState.id IN (:...engineStateIds) OR NOT EXISTS (
          SELECT 1 FROM "preference_engineStates" pes
          WHERE pes."preferenceId" = preference.id
      ))`,
        { engineStateIds: [carListing.engineState.id] },
      )
      .andWhere(
        `(chassisState.id IN (:...chassisStateIds) OR NOT EXISTS (
          SELECT 1 FROM "preference_chassisStates" pchs
          WHERE pchs."preferenceId" = preference.id
      ))`,
        { chassisStateIds: [carListing.chassisState.id] },
      )
      .andWhere(
        `(bodyState.id IN (:...bodyStateIds) OR NOT EXISTS (
          SELECT 1 FROM "preference_bodyStates" pbs
          WHERE pbs."preferenceId" = preference.id
      ))`,
        { bodyStateIds: [carListing.bodyState.id] },
      )
      .select(['preference', 'user.phone', 'user.id']);
    // .groupBy('user.id');

    return queryBuilder.getMany();
  }

  private async findEntitiesByIds<T>(
    repository: Repository<T>,
    ids: number[] | null,
  ): Promise<T[]> {
    try {
      if (!ids || ids.length === 0) {
        return [];
      }
      const entities = await repository
        .createQueryBuilder('entity')
        .where('entity.id IN (:...ids)', { ids })
        .getMany();
      return entities;
    } catch (error) {
      this.logger.log('Error finding entities by ids', error);
      return [];
    }
  }
}
