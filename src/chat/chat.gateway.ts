import { ChatService } from '@/chat/chat.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CreateChatMessageDto } from '@/chat/dto/create-chat-message.dto';
import { AuthWsMiddleware } from '@/auth/auth-ws.middleware';
import { UsersService } from '@/users/users.service';
import { AuthClsStore } from '@/cls.store';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private readonly cls: ClsService<AuthClsStore>,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: CreateChatMessageDto,
  ): Promise<void> {
    await this.chatService.createMessage(data);
    this.server.to(data.chatId).emit('receiveMessage', data);
  }

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

  afterInit(server: Server) {
    const middle = AuthWsMiddleware(
      this.jwtService,
      this.usersService,
      this.cls,
    );
    server.use(middle);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    console.log(`Connected ${client.id}`);
  }
}
