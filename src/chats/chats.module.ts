import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { User } from '@/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '@/chats/entities/chat.entity';
import { Message } from '@/chats/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Message])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
