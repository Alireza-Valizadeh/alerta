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
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  RegisterUserV2Dto,
  registerUserV2Schema,
} from '../users/dto/register-user-v2-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login/password')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const token = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return { access_token: token };
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(registerUserV2Schema))
  async loginByCode(
    @Body() loginDto: RegisterUserV2Dto,
  ): Promise<{ code: string }> {
    const code = await this.authService.loginByCode(loginDto);
    return { code };
  }

  @Post('login/validate')
  async validateLoginCode(
    @Body() loginInfo: { phone: string; code: string },
  ): Promise<{ access_token: string }> {
    const token = await this.authService.validateLoginCode(
      loginInfo.phone,
      loginInfo.code,
    );
    return { access_token: token };
  }
}
