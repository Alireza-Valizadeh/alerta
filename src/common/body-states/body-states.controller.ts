import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BodyStatesService } from './body-states.service';
import { MyLoggerService } from '../../logger/logger.service';
import { BodyState } from '../entities/bodyState.entity';

@Controller('body-states')
export class BodyStatesController {
  constructor(
    private bodyStatesService: BodyStatesService,
    private readonly logger: MyLoggerService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createGearbox(@Body('title') title: string): Promise<BodyState> {
    this.logger.log('Creating body state', title);
    return this.bodyStatesService.createBodyState(title);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateGearbox(
    @Param() id: number,
    @Body('title') title: string,
  ): Promise<boolean> {
    return this.bodyStatesService.updateGearbox(id, title);
  }
}
