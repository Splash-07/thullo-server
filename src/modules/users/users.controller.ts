import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { GetCurrentUser } from '../../common/decorators';
import { AuthenticatedGuard, LocalAuthGuard } from '../../common/guards';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dtos';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() dto: CreateUserDto): Promise<{ message: string }> {
    return this.usersService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginUserDto): Promise<{ message: string }> {
    return this.usersService.login(dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('logout')
  logout(@Req() req: Request): { message: string } {
    req.logout();

    return {
      message: 'Successful logout',
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('authenticated')
  isAuthenticated() {
    return true;
  }

  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch()
  async updateUser(
    @Body() dto: UpdateUserDto,
    @GetCurrentUser() user: User,
  ): Promise<{ message: string }> {
    return this.usersService.updateUser(dto, user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getUser(@GetCurrentUser() user: User): Promise<User> {
    return this.usersService.getUser(user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete()
  async deleteUser(
    @GetCurrentUser() user: User,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    req.logout();
    return this.usersService.deleteUser(user.id);
  }
}
