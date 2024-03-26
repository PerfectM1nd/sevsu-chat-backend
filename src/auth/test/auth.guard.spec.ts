import { AuthGuard } from '../auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
    } as any;

    reflector = new Reflector();
  });

  it('should be defined', () => {
    expect(new AuthGuard(jwtService, reflector)).toBeDefined();
  });
});
