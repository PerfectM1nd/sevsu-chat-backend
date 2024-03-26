import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/auth/auth.guard';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "@/users/entities/user.entity";
import {Repository} from "typeorm";

describe('AuthService', () => {
  let service: AuthService;

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
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
