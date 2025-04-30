import { Module } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodyState } from '../common/entities/bodyState.entity';
import { ChassisState } from '../common/entities/chassisState.entity';
import { City } from '../common/entities/city.entity';
import { Color } from '../common/entities/color.entity';
import { EngineState } from '../common/entities/engineState.entity';
import { FuelType } from '../common/entities/fuelType.entity';
import { Gearbox } from '../common/entities/gearbox.entity';
import { Make } from '../common/entities/make.entity';
import { Model } from '../common/entities/model.entity';
import { State } from '../common/entities/state.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
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
  providers: [SeedService],
})
export class DatabaseModule {}
