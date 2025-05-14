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
  Version,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { RegisterUserDto, registerUserSchema } from './dto/register-user.dto';
import {
  RegisterUserV2Dto,
  registerUserV2Schema,
} from './dto/register-user-v2-dto';

@Controller({
  path: 'users',
})
export class UsersController {
  constructor(private usersService: UsersService) {}
  // protected routes
  @Get('profile')
  @UseGuards(AuthGuard)
  getUserProfile(@Request() request) {
    return this.usersService.findOneById(request.user.sub);
  }

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
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
  createUser(@Body() user: RegisterUserDto) {
    return this.usersService.register(user);
  }

  @Version('2')
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerUserV2Schema))
  createUserV2(@Body() user: RegisterUserV2Dto) {
    return this.usersService.registerV2(user);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() user: Partial<User>) {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Delete(':id')
  @Version('2')
  deleteUserV2(@Param('id') id: number) {
    console.log('This is V2');
    return this.usersService.delete(id);
  }
}
