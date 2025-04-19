import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { registerUserSchema } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // protected routes
  @Get('profile')
  @UseGuards(AuthGuard)
  getUserProfile(@Request() request) {
    return this.usersService.findOneById(request.user.sub);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }
  @Get('/email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerUserSchema))
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
}
