import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from '@/chat/chat.service';
import { Chat } from '@/chat/entities/chat';
import { ChatMessage } from '@/chat/entities/chatMessage';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from '@/chat/chat.gateway';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatMessage]), UsersModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
