import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { userConstants } from './constants';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async register(user: Omit<User, 'id'>): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(
      user.password,
      userConstants.saltRounds,
    );
    user.password = hashedPassword;
    const registeredUser = await this.usersRepository.save(user);
    Reflect.deleteProperty(registeredUser, 'password');
    return registeredUser;
  }
  update(id: number, user: Partial<User>): Promise<UpdateResult> {
    return this.usersRepository.update(id, user);
  }
  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }
  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }
  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
