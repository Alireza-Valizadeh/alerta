import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Make } from './make.entity';
import { Model } from './model.entity';
import { Color } from './color.entity';
import { State } from './state.entity';
import { City } from './city.entity';
import { Gearbox } from './gearbox.entity';
import { FuelType } from './fuelType.entity';
import { EngineState } from './engineState.entity';
import { ChassisState } from './chassisState.entity';
import { BodyState } from './bodyState.entity';

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
})
export class CommonModule {}
