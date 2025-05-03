import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import {
  CreatePreferenceDto,
  createPreferenceSchema,
  UpdatePreferenceDto,
  updatePreferenceSchema,
} from './dto/preference.dto';
import { Preference } from './preference.entity';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { AuthGuard } from '../auth/auth.guard';

@Controller('preferences')
export class PreferencesController {
  constructor(private preferencesService: PreferencesService) {}
  @Get()
  getAll() {
    return this.preferencesService.findAll();
  }
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.preferencesService.findOne(id);
  }
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPreferenceSchema))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Request() request,
    @Body() createPreferenceDto: CreatePreferenceDto,
  ): Promise<Preference> {
    const uid = request.user.sub;
    return this.preferencesService.create(uid, createPreferenceDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(updatePreferenceSchema))
  update(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePreferenceDto: UpdatePreferenceDto,
  ): Promise<Preference> {
    const uid = request.user.sub;
    return this.preferencesService.update(uid, id, updatePreferenceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Preference> {
    const uid = request.user.sub;
    return this.preferencesService.delete(uid, id);
  }
}
