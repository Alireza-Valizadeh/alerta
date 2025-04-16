import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  create(user: Omit<User, 'id'>): Promise<User> {
    return this.usersRepository.save(user);
  }
  update(id: number, user: Partial<User>): Promise<UpdateResult> {
    return this.usersRepository.update(id, user);
  }
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
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
