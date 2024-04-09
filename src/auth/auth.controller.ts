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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body(new ValidationPipe()) signInDto: LoginDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body(new ValidationPipe()) signUpDTO: SignupDto) {
    return this.authService.signUp(signUpDTO);
  }

  @Public()
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken() {
    return await this.authService.refreshToken();
  }

  @Get('me')
  getProfile() {
    return getCurrentUser();
  }
}
