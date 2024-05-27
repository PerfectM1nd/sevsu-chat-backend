import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { AuthClsStore } from '@/cls.store';
import { ClsService } from 'nestjs-cls';
import { UnauthorizedException } from '@nestjs/common';

export interface AuthSocket extends Socket {
  user: User;
}

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const AuthWsMiddleware = (
  jwtService: JwtService,
  usersService: UsersService,
  cls: ClsService<AuthClsStore>,
): SocketMiddleware => {
  return async (socket: AuthSocket) => {
    try {
      const tokenPayload = await jwtService.verifyAsync(
        socket.handshake?.auth?.jwt ?? '',
        {
          secret: process.env.jwtSecretKey,
        },
      );

      console.log(tokenPayload);

      cls.set('tokenPayload', tokenPayload);
      cls.set('authUser', await usersService.findById(tokenPayload.id));
    } catch (e) {
      throw new UnauthorizedException();
    }
  };
};
