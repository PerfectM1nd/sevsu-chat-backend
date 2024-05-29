import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketAuthGuard } from '@/auth/guards/socket.guard';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
@UseGuards(SocketAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinChat')
  public joinRoom(client: Socket, chatId: string): void {
    client.join(chatId);
    this.server.emit('joinedChat', chatId);
  }

  @SubscribeMessage('leaveChat')
  public leaveRoom(client: Socket, chatId: string): void {
    client.leave(chatId);
    this.server.emit('leftChat', chatId);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
  }
}
