import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '@/auth/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/auth/auth.guard';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        UsersService,
        JwtService,
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
