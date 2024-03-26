import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from '@/auth/dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDTO: SignupDto): Promise<{ access_token: string }> {
    if (await this.usersService.findByUsername(signUpDTO.username)) {
      throw new BadRequestException('User with this username already exists');
    }
    if (await this.usersService.findByEmail(signUpDTO.email)) {
      throw new BadRequestException('User with this email already exists');
    }
    const user = await this.usersService.create(signUpDTO);
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
