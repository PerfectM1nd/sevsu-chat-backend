import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { compare } from 'bcrypt';
import { User } from '@/users/entities/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '@/cls.store';
import { LoginDto } from '@/auth/dto/login.dto';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly cls: ClsService<AuthClsStore>,
  ) {}

  async signIn(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const payload = {
      id: user.id,
      username: user.email,
      sub: {
        name: user.username,
      },
    };

    await this.cacheManager.set('online:' + user.username, true);

    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '30s',
          secret: process.env.jwtSecretKey,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.jwtRefreshTokenKey,
        }),
        expiresAt: new Date().setTime(Date.now() + EXPIRE_TIME),
      },
    };
  }

  async validateUser(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (user && (await compare(dto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException();
  }

  async signUp(createUserDTO: CreateUserDto): Promise<User> {
    if (await this.usersService.findByUsername(createUserDTO.username)) {
      throw new BadRequestException(
        'Пользователь с таким логином уже существует',
      );
    }
    if (await this.usersService.findByEmail(createUserDTO.email)) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
    return await this.usersService.create(createUserDTO);
  }

  async refreshToken() {
    const tokenPayload = this.cls.get('tokenPayload');

    const payload = {
      id: tokenPayload.id,
      username: tokenPayload.username, //email
      sub: tokenPayload.sub,
    };

    await this.cacheManager.set('online:' + tokenPayload.sub.name, true);

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '30s',
        secret: process.env.jwtSecretKey,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.jwtRefreshTokenKey,
      }),
      expiresAt: new Date().setTime(Date.now() + EXPIRE_TIME),
    };
  }
}
