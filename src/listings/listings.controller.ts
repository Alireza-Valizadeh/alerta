import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  CreateListingDto,
  createListingSchema,
} from './dto/create-listing.dto';
import { ListingsService } from './listings.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { Listing } from './listing.entity';
import { createListingFromDivarDto } from './dto/create-listing-from-divar.dto';
import { MyLoggerService } from '../core/logger.service';

@Controller('listings')
export class ListingsController {
  constructor(
    private listingsService: ListingsService,
    private readonly logger: MyLoggerService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createListingSchema))
  createListing(@Body() createListingDto: CreateListingDto): Promise<Listing> {
    return this.listingsService.addListing(createListingDto);
  }

  @Post('crawl/divar')
  @HttpCode(HttpStatus.CREATED)
  createListingFromDivar(
    @Body() createListingFromDivar: createListingFromDivarDto[],
  ): true {
    this.logger.log('createListingFromDivar', createListingFromDivar);
    this.listingsService.addListingFromDivar(createListingFromDivar);
    return true;
  }

  @Get()
  getAllListings(): Promise<Listing[]> {
    return this.listingsService.getAllListings();
  }

  @Get('/users/:uid')
  getUserListings(@Param('uid', ParseIntPipe) uid: number): Promise<Listing[]> {
    return this.listingsService.getUserListings(uid);
  }

  @Get('/creation-data')
  getListingCreationData() {
    return this.listingsService.getListingCreationData();
  }

  @Get(':id')
  getListingById(@Param('id', ParseIntPipe) id: number): Promise<Listing> {
    return this.listingsService.getListingById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteListing(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    await this.listingsService.deleteListing(id);
    return true;
  }
}
