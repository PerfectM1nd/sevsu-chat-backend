import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const token = context.switchToWs().getClient().handshake.auth.jwt;

      const tokenPayload = await this.jwtService.verifyAsync(token ?? '', {
        secret: process.env.jwtSecretKey,
      });

      return !!tokenPayload;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
