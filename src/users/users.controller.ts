import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { Public } from '@/auth/decorators';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('list-online')
  @ApiOperation({ summary: 'Get list of online users' })
  @ApiOkResponse({ description: 'List of online users.' })
  getOnlineUsers() {
    return this.usersService.getOnlineUsers();
  }

  @Public()
  @Get('is-online/:username')
  @ApiOperation({ summary: 'Check if a user is online' })
  @ApiOkResponse({ description: 'Online status of the user.' })
  isUserOnline(@Param('username') username: string) {
    return this.usersService.isUserOnline(username);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'List of all users.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('search/:fullName')
  @ApiOperation({ summary: 'Search users by full name' })
  @ApiOkResponse({ description: 'List of users matching the full name.' })
  findByFullName(@Param('fullName') fullName: string) {
    return this.usersService.findByFullName(fullName);
  }
}
