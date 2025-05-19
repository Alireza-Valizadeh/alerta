import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MyLoggerService } from '../core/logger.service';
import { RegisterUserV2Dto } from '../users/dto/register-user-v2-dto';
import { User } from '../users/user.entity';
import { RedisService } from '../core/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Messages } from './constants';
import { customAlphabet } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private redisService: RedisService,
    private notifService: NotificationsService,
    private readonly logger: MyLoggerService,
  ) {}
  async validateUser(email: string, password: string): Promise<string> {
    this.logger.log({ email, password });
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordOk = await bcrypt.compare(password, user.password);
    if (!isPasswordOk) {
      throw new UnauthorizedException('Password incorrect!');
    }
    const token = this.generateAccessToken(user);
    return token;
  }

  async loginByCode(userDto: RegisterUserV2Dto): Promise<void> {
    let user = await this.usersService.findOneByPhone(userDto.phone);
    if (!user) {
      user = await this.usersService.registerV2(userDto);
    }
    const code = await this.generate2faCode();
    this.logger.log('code generated', { phone: user.phone, code });
    this.redisService.set(`2fa-${user.phone}`, code, 60);
    // this.notifService.sendVertificationCode(user.phone, code);
  }

  async validateLoginCode(phone: string, code: string): Promise<string> {
    const user = await this.usersService.findOneByPhone(phone);
    if (!user) {
      throw new UnauthorizedException(Messages.PHONE_NOT_FOUND);
    }
    const storedCode = await this.redisService.get(`2fa-${user.phone}`);
    if (!storedCode) {
      throw new UnauthorizedException(Messages.CODE_EXPIRED);
    }
    if (storedCode !== code) {
      throw new UnauthorizedException(Messages.INVALID_CODE);
    }
    const token = this.generateAccessToken(user);
    return token;
  }

  private async generate2faCode(): Promise<string> {
    const generator = customAlphabet('123456789', 4);
    return generator(4);
  }

  private generateAccessToken(user: User): string {
    const payload = { sub: user.id, email: user?.email, phone: user.phone };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
