import { Module } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { PreferencesController } from './preferences.controller';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preference } from './preference.entity';

@Module({
  imports: [UsersModule, CommonModule, TypeOrmModule.forFeature([Preference])],
  providers: [PreferencesService],
  controllers: [PreferencesController],
  exports: [PreferencesService, TypeOrmModule],
})
export class PreferencesModule {}
