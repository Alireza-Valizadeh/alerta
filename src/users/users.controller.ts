import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }
  @Get(':email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }
  @Post('register')
  createUser(@Body() user: Omit<User, 'id'>) {
    return this.usersService.register(user);
  }
  @Put(':id')
  updateUser(@Param('id') id: number, @Body() user: Partial<User>) {
    return this.usersService.update(id, user);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
  // protected routes
  // TODO - does not work
  @Get('profile')
  @UseGuards(AuthGuard)
  getUserProfile(@Request() req) {
    console.log({ req });
    const id = req.user.sub;
    console.log({ id });
    return this.usersService.findOneById(id);
  }
}
