import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { Public } from '@/auth/decorators';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('list-online')
  getOnlineUsers() {
    return this.usersService.getOnlineUsers();
  }

  @Public()
  @Get('is-online/:username')
  isUserOnline(@Param('username') username: string) {
    return this.usersService.isUserOnline(username);
  }

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search/:fullName')
  findByFullName(@Param('fullName') fullName: string) {
    return this.usersService.findByFullName(fullName);
  }
}
