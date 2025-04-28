import { Controller, Get } from '@nestjs/common';
import { FuelTypesService } from './fuel-types.service';

@Controller('fuel-types')
export class FuelTypesController {
  constructor(private fuelTypesService: FuelTypesService) {}
  @Get()
  getFuelTypes() {
    return this.fuelTypesService.getFuelTypes();
  }
}
