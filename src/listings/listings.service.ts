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
import { NotificationsService } from '../notifications/notifications.service';
import { PreferencesService } from '../preferences/preferences.service';

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
    private statesRepository: Repository<State>,
    private readonly logger: MyLoggerService,
    private notifService: NotificationsService,
    private preferencesService: PreferencesService,
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
      try {
        const rawListing = await this.mapDivarToListing(info);
        const existingListing = await this.listingsRepository.findOne({
          where: { link: rawListing.link },
        });
        if (existingListing) {
          this.logger.log('Listing already exists, skipping', info.title);
          continue;
        }
        const savedListing = await this.addListing(rawListing);
        listings.push(savedListing);
      } catch (error) {
        this.logger.error('Error adding listing from divar', info, error);
        continue;
      }
    }
    await this.processListingsAndNotify(listings);
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
    const gearbox = await this.findLookupEntityByTitle(
      this.gearboxesRepository,
      info.details.transmission,
      PersianTranslations.Gearboxes,
      // 'gearbox',
    );
    const bodyState = await this.findLookupEntityByTitle(
      this.bodyStatesRepository,
      info.details.bodyState,
      PersianTranslations.BodyStates,
      // 'body state',
    );
    const chassisState = await this.findLookupEntityByTitle(
      this.chassisStatesRepository,
      info.details.chassisState,
      PersianTranslations.ChassisStates,
      // 'chassis state',
    );
    const color = await this.findLookupEntityByTitle(
      this.colorsRepository,
      info.details.color,
      PersianTranslations.Colors,
      // 'color',
    );
    const engineState = await this.findLookupEntityByTitle(
      this.engineStatesRepository,
      info.details.engineState,
      PersianTranslations.EngineStates,
      // 'engine state',
    );
    const fuelType = await this.findLookupEntityByTitle(
      this.fuelTypesRepository,
      info.details.fuelType,
      PersianTranslations.FuelTypes,
      // 'fuel type',
    );
    const make = await this.makesRepository.findOneBy({
      title: info.details.make,
    });
    let model = await this.modelsRepository.findOneBy({
      title: info.details.make + ' ' + info.details.model,
    });
    if (make && !model) {
      model = await this.modelsRepository.findOneBy({
        title: PersianTranslations.GeneralStatements.Undefined,
      });
    }
    const city = await this.citiesRepository.findOneBy({
      title: 'مشهد',
    });
    const state = await this.statesRepository.findOneBy({
      title: 'خراسان رضوی',
    });
    const dto: Required<CreateListingDto> = {
      title: info.title,
      description: info.details?.description?.slice(0, 497).concat('...') || '',
      link: info.vdpUrl,
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
      makeId: make.id,
      modelId: model.id,
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
  private async findLookupEntityByTitle<T extends { title: string }>(
    repository: Repository<T>,
    title: string | null,
    translations: Record<string, string>,
    // entityName: string,
  ): Promise<T | null> {
    const defaultTitle = translations?.Undefined;
    const searchTerm = title || defaultTitle;
    // this.logger.log(`Searching for ${entityName}: ${searchTerm}`);

    let entity = await repository.findOneBy({ title: searchTerm } as any);
    if (entity) return entity;

    for (const keyword of Object.values(translations || {})) {
      // this.logger.log(`Searching for ${entityName} with keyword: ${keyword}`);
      if (searchTerm?.includes(keyword)) {
        entity = await repository.findOneBy({ title: keyword } as any);
        if (entity) return entity;
      }
    }
    return null;
  }
  private async processListingsAndNotify(listings: Listing[]) {
    for (const listing of listings) {
      const uniqueUsers = new Map<number, User>();
      const phones: string[] = [];
      const matchingPrefs =
        await this.preferencesService.findMatchingPreferences(listing);
      this.logger.log('Matching prefs', matchingPrefs.length);
      this.logger.log('Matching prefs', matchingPrefs);
      for (const pref of matchingPrefs) {
        if (pref.user && !uniqueUsers.has(pref.user.id)) {
          uniqueUsers.set(pref.user.id, pref.user);
          phones.push(pref.user.phone);
        }
      }
      const msg = `آگهی جدید: ${listing.model.title} مدل ${listing.year}
      ${listing.link}`;
      if (phones.length > 0) {
        await this.notifService.sendBulkSms(phones, msg);
      }
    }
  }
}
