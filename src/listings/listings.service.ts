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
import { User } from '../users/user.entity';
import { createListingFromDivarDto } from './dto/create-listing-from-divar.dto';
import { MyLoggerService } from '../logger/logger.service';
import { PersianTranslations } from '../common/enums/translations.enum';

@Injectable()
export class ListingsService {
  private listingsRelations: string[];
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    private readonly logger: MyLoggerService,
  ) {
    this.listingsRelations = [
      'user',
      'make',
      'model',
      'color',
      'state',
      'city',
      'gearbox',
      'bodyState',
      'chassisState',
      'engineState',
      'fuelType',
    ];
  }
  async addListing(createListingDto: CreateListingDto): Promise<Listing> {
    const user = await this.usersRepository.findOneBy({
      id: createListingDto.uid,
    });
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
      user,
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

  async addListingFromDivar(
    cars: createListingFromDivarDto[],
  ): Promise<Listing[]> {
    const listings: Listing[] = [];
    for (const info of cars) {
      const rawListing = await this.mapDivarToListing(info);
      const savedListing = await this.addListing(rawListing);
      listings.push(savedListing);
    }
    return listings;
  }

  async getListingById(id: number): Promise<Listing> {
    const listing = await this.listingsRepository.findOne({
      where: { id },
      relations: this.listingsRelations,
    });
    if (!listing) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }
    return listing;
  }

  getAllListings(): Promise<Listing[]> {
    return this.listingsRepository.find({
      relations: this.listingsRelations,
    });
  }

  getUserListings(uid: number): Promise<Listing[]> {
    return this.listingsRepository.findBy({
      user: { id: uid },
    });
  }

  async deleteListing(id: number): Promise<void> {
    await this.listingsRepository.delete(id);
  }

  async getListingCreationData(): Promise<any> {
    const [
      makes,
      colors,
      states,
      gearboxes,
      fuelTypes,
      engineStates,
      chassisStates,
      bodyStates,
    ] = await Promise.all([
      this.makesRepository.find(),
      this.colorsRepository.find(),
      this.statesRepository.find(),
      this.gearboxesRepository.find(),
      this.fuelTypesRepository.find(),
      this.engineStatesRepository.find(),
      this.chassisStatesRepository.find(),
      this.bodyStatesRepository.find(),
    ]);
    return {
      makes,
      colors,
      states,
      gearboxes,
      fuelTypes,
      engineStates,
      chassisStates,
      bodyStates,
    };
  }
  private async mapDivarToListing(
    info: createListingFromDivarDto,
  ): Promise<CreateListingDto> {
    const user = await this.usersRepository.findOneBy({
      email: 'divar@gmail.com',
    });
    const gearbox = await this.gearboxesRepository.findOneBy({
      title: info.details.transmission || PersianTranslations.Gearboxes.Manual,
    });
    const bodyState = await this.bodyStatesRepository.findOneBy({
      title: info.details.bodyState || PersianTranslations.BodyStates.Perfect,
    });
    const chassisState = await this.chassisStatesRepository.findOneBy({
      title:
        info.details.chassisState ||
        PersianTranslations.ChassisStates.Undefined,
    });
    const color = await this.colorsRepository.findOneBy({
      title: info.details.color || PersianTranslations.Colors.White,
    });
    const engineState = await this.engineStatesRepository.findOneBy({
      title: info.details.engineState || PersianTranslations.EngineStates.Ok,
    });
    const fuelType = await this.fuelTypesRepository.findOneBy({
      title: info.details.fuelType || PersianTranslations.FuelTypes.Petrol,
    });
    const city = await this.citiesRepository.findOneBy({
      title: 'مشهد',
    });
    const state = await this.statesRepository.findOneBy({
      title: 'خراسان رضوی',
    });
    // @ts-expect-error test
    const dto: Required<CreateListingDto> = {
      title: info.title,
      description: info.details.description.slice(0, 497).concat('...'),
      mileage: this.parseMileageToNumber(info.mileage),
      price: this.parsePriceToNumber(info.price),
      year: this.parseYearToNumber(info.details.year),
      insuranceDuration: this.parseInsuranceToNumber(
        info.details?.insuranceDuration,
      ),
      isSold: false,
      isApproved: false,
      uid: user.id,
      gearboxId: gearbox.id,
      bodyStateId: bodyState.id,
      chassisStateId: chassisState.id,
      colorId: color.id,
      engineStateId: engineState.id,
      fuelTypeId: fuelType.id,
      cityId: city.id,
      stateId: state.id,
    };
    return dto;
  }
  private persianArabicToEnglish(str: string) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let result = String(str); // Ensure it's a string

    for (let i = 0; i < 10; i++) {
      result = result.replace(
        new RegExp(persianDigits[i], 'g'),
        englishDigits[i],
      );
      result = result.replace(
        new RegExp(arabicDigits[i], 'g'),
        englishDigits[i],
      );
    }
    return result;
  }
  private parseMileageToNumber(mileageString: string): number | null {
    try {
      const cleanedString = mileageString
        .replace(/کیلومتر/g, '')
        .replace(/٬|,/g, '')
        .trim();

      const englishNumerals = this.persianArabicToEnglish(cleanedString);
      const mileage = parseInt(englishNumerals, 10);
      return isNaN(mileage) ? null : mileage;
    } catch (error) {
      this.logger.error('Error parsing mileage', error);
      return null;
    }
  }
  private parsePriceToNumber(priceString: string): number | null {
    try {
      const cleanedString = priceString
        .replace(/تومان/g, '')
        .replace(/٬|,/g, '')
        .trim();

      const englishNumerals = this.persianArabicToEnglish(cleanedString);
      const price = parseInt(englishNumerals, 10);
      return isNaN(price) ? null : price;
    } catch (error) {
      this.logger.error('Error parsing price', error);
      return null;
    }
  }
  private parseInsuranceToNumber(insuranceString: string): number | null {
    try {
      if (!insuranceString) return null;
      const cleanedString = insuranceString
        .replace(/ماه/g, '')
        .replace(/٬|,/g, '')
        .trim();

      const englishNumerals = this.persianArabicToEnglish(cleanedString);
      const insurance = parseInt(englishNumerals, 10);
      return isNaN(insurance) ? null : insurance;
    } catch (error) {
      this.logger.error('Error parsing insurance', error);
      return null;
    }
  }
  private parseYearToNumber(yearString: string): number | null {
    try {
      const englishNumerals = this.persianArabicToEnglish(yearString);
      const year = parseInt(englishNumerals, 10);
      return isNaN(year) ? null : year;
    } catch (error) {
      this.logger.error('Error parsing year', error);
      return null;
    }
  }
}
