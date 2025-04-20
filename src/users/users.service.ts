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
import { MyLoggerService } from 'src/logger/logger.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly logger: MyLoggerService,
  ) {}
  async register(user: Omit<User, 'id'>): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersRepository.findOneBy({
      email: user.email,
    });
    if (existingUser) {
      this.logger.log('New user tried an existing email', user.email);
      throw new ConflictException(UserMessages.Duplicate);
    }
    const hashedPassword = await bcrypt.hash(
      user.password,
      userConstants.saltRounds,
    );
    user.password = hashedPassword;
    const registeredUser = await this.usersRepository.save(user);
    Reflect.deleteProperty(registeredUser, 'password');
    this.logger.log('New user registered', registeredUser);
    return registeredUser;
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
  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
