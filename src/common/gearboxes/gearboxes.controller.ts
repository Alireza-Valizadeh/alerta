import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Gearbox } from '../entities/gearbox.entity';
import { GearboxesService } from './gearboxes.service';
import { MyLoggerService } from '../../logger/logger.service';

@Controller('gearboxes')
export class GearboxesController {
  constructor(
    private gearboxesService: GearboxesService,
    private readonly logger: MyLoggerService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createGearbox(@Body('title') title: string): Promise<Gearbox> {
    this.logger.log('Creating gearbox', title);
    return this.gearboxesService.createGearbox(title);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateGearbox(
    @Param() id: number,
    @Body('title') title: string,
  ): Promise<boolean> {
    return this.gearboxesService.updateGearbox(id, title);
  }
}
