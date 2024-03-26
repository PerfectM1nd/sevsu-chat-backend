import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@/auth/decorators';
import { UsersService } from '@/users/users.service';
import { Request } from 'express';
import { SignupDto } from '@/auth/dto/signup.dto';
import { LoginDto } from '@/auth/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body(new ValidationPipe()) signInDto: LoginDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body(new ValidationPipe()) signUpDTO: SignupDto) {
    return this.authService.signUp(signUpDTO);
  }

  @Get('me')
  getProfile(@Req() request: Request) {
    return this.usersService.getCurrentUser(request);
  }
}
