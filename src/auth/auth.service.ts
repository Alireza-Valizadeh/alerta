import { customAlphabet } from 'nanoid';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MyLoggerService } from '../core/logger.service';
import { RegisterUserV2Dto } from '../users/dto/register-user-v2-dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
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

  async loginByCode(userDto: RegisterUserV2Dto): Promise<string> {
    let user = await this.usersService.findOneByPhone(userDto.phone);
    if (!user) {
      user = await this.usersService.registerV2(userDto);
    }
    const code = this.generate2faCode();
    // save code in redis or db or mem
    return code;
  }

  async validateLoginCode(phone: string, code: string): Promise<string> {
    // check code in redis or db or mem
    const user = await this.usersService.findOneByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('Invalid phone number!');
    }
    const token = this.generateAccessToken(user);
    return token;
  }

  private generate2faCode(): string {
    const generator = customAlphabet('123456789', 4);
    return generator(4);
  }

  private generateAccessToken(user: User): string {
    const payload = { sub: user.id, email: user?.email, phone: user.phone };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
