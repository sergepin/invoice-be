import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from '../interface/request-user.interface';
import { AdminGuard } from '../guards/admin.guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string): Promise<User | null> {
    return await this.userService.findById(id);
  }

  @Post()
  async create(
    @Body()
    createUserDto: {
      name: string;
      email: string;
      password: string;
      role: string;
    },
  ): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Req() req: Request & { user: RequestUser },
    @Param('id') targetUserId: string,
    @Body() updateUserDto: any,
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;

    return this.userService.update(
      userId,
      targetUserId,
      updateUserDto,
      userRole,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
