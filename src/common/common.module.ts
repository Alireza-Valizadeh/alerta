import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Make } from './entities/make.entity';
import { Model } from './entities/model.entity';
import { Color } from './entities/color.entity';
import { State } from './entities/state.entity';
import { City } from './entities/city.entity';
import { Gearbox } from './entities/gearbox.entity';
import { FuelType } from './entities/fuelType.entity';
import { EngineState } from './entities/engineState.entity';
import { ChassisState } from './entities/chassisState.entity';
import { BodyState } from './entities/bodyState.entity';
import { GearboxesService } from './gearboxes/gearboxes.service';
import { GearboxesController } from './gearboxes/gearboxes.controller';
import { BodyStatesService } from './body-states/body-states.service';
import { BodyStatesController } from './body-states/body-states.controller';
import { FuelTypesService } from './fuel-types/fuel-types.service';
import { FuelTypesController } from './fuel-types/fuel-types.controller';
import { CitiesService } from './cities/cities.service';
import { CitiesController } from './cities/cities.controller';
import { ModelsService } from './models/models.service';
import { ModelsController } from './models/models.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Make,
      Model,
      Color,
      State,
      City,
      Gearbox,
      FuelType,
      EngineState,
      ChassisState,
      BodyState,
    ]),
  ],
  providers: [
    GearboxesService,
    BodyStatesService,
    FuelTypesService,
    CitiesService,
    ModelsService,
  ],
  controllers: [
    GearboxesController,
    BodyStatesController,
    FuelTypesController,
    CitiesController,
    ModelsController,
  ],
  exports: [TypeOrmModule, GearboxesService],
})
export class CommonModule {}
