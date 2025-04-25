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
  providers: [GearboxesService],
  controllers: [GearboxesController],
  exports: [TypeOrmModule, GearboxesService],
})
export class CommonModule {}
