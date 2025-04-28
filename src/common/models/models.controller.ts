import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ModelsService } from './models.service';
import { Model } from '../entities/model.entity';

@Controller('models')
export class ModelsController {
  constructor(private modelsService: ModelsService) {}

  @Get('makes/:makeId')
  getMakeModels(
    @Param('makeId', ParseIntPipe) makeId: number,
  ): Promise<Model[]> {
    return this.modelsService.getMakeModels(makeId);
  }
}
