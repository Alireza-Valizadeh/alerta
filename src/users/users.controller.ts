import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }
  @Get(':email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }
  @Post()
  createUser(@Body() user: Omit<User, 'id'>) {
    return this.usersService.create(user);
  }
  @Put(':id')
  updateUser(@Param('id') id: number, @Body() user: Partial<User>) {
    return this.usersService.update(id, user);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
