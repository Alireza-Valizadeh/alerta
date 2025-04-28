import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}
  @Get('states/:stateId')
  getStateCities(@Param('stateId', ParseIntPipe) stateId: number) {
    return this.citiesService.getStateCities(stateId);
  }
}
