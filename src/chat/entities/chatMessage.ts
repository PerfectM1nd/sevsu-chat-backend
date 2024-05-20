import { BaseEntity } from '@/common/base-entity';
import { User } from '@/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from '@/chat/entities/chat';

@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.chatMessages)
  chat: Chat;

  @ManyToOne(() => User, (user) => user.chatMessages)
  user: User;

  @Column()
  text: string;
}
