import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, loginSchema } from './dto/login.dto';
import { ZodValidationPipe } from '..//pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.validateUser(loginDto.email, loginDto.password);
  }
}
