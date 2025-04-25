import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

@Controller('listings')
export class ListingsController {
  constructor(private listingsService: ListingsService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createListingSchema))
  createListing(@Body() createListingDto: CreateListingDto): Promise<Listing> {
    return this.listingsService.addListing(createListingDto);
  }

  @Get(':id')
  getListingById(@Param('id') id: number): Promise<Listing> {
    return this.listingsService.getListingById(id);
  }
}
