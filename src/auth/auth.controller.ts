import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@/auth/decorators';
import { SignupDto } from '@/auth/dto/signup.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { getCurrentUser } from '@/auth/auth.storage';
import { RefreshJwtGuard } from '@/auth/guards/refresh.guard';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiOkResponse({ description: 'User successfully logged in.' })
  @ApiBody({ type: LoginDto, description: 'User login credentials' })
  signIn(@Body(new ValidationPipe()) signInDto: LoginDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiCreatedResponse({ description: 'User successfully signed up.' })
  @ApiBody({ type: SignupDto, description: 'User registration details' })
  signUp(@Body(new ValidationPipe()) signUpDTO: SignupDto) {
    return this.authService.signUp(signUpDTO);
  }

  @Public()
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ description: 'Token successfully refreshed.' })
  async refreshToken() {
    return await this.authService.refreshToken();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'User profile information.' })
  getProfile() {
    return getCurrentUser();
  }
}
