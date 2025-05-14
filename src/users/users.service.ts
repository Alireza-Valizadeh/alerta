import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { userConstants } from './constants';
import { UserMessages } from './enums/user-messages.enum';
import { MyLoggerService } from '../core/logger.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { Gender } from './enums/genders.enum';
import { RegisterUserV2Dto } from './dto/register-user-v2-dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly logger: MyLoggerService,
  ) {}

  async register(userDto: RegisterUserDto): Promise<Omit<User, 'password'>> {
    if (userDto.password !== userDto.confirmPassword) {
      throw new ConflictException(UserMessages.PasswordMismatch);
    }
    const existingUser = await this.usersRepository.findOneBy({
      email: userDto.email,
    });
    if (existingUser) {
      this.logger.log('New user tried an existing email', userDto.email);
      throw new ConflictException(UserMessages.Duplicate);
    }
    const hashedPassword = await bcrypt.hash(
      userDto.password,
      userConstants.saltRounds,
    );
    userDto.password = hashedPassword;
    const user = this.usersRepository.create({
      ...userDto,
      gender: userDto.gender as Gender,
    });
    const registeredUser = await this.usersRepository.save(user);
    Reflect.deleteProperty(registeredUser, 'password');
    this.logger.log('New user registered', registeredUser);
    return registeredUser;
  }

  async registerV2(userDto: RegisterUserV2Dto): Promise<User> {
    const existingUser = await this.findOneByPhone(userDto.phone);
    if (existingUser) {
      this.logger.log('New user tried an existing phone number', userDto.phone);
      throw new ConflictException(UserMessages.Duplicate);
    }
    const user = this.usersRepository.create({
      phone: userDto.phone,
    });
    await this.usersRepository.save(userDto);
    return user;
  }

  update(id: number, user: Partial<User>): Promise<UpdateResult> {
    return this.usersRepository.update(id, user);
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(UserMessages.NotFound);
    }
    return user;
  }
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(UserMessages.NotFound);
    }
    return user;
  }

  async findOneByPhone(phone: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ phone });
    return user;
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
