import { BaseEntity } from '@/common/base-entity';
import { User } from '@/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Chat } from '@/chat/entities/chat';

@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.chatMessages)
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column({ nullable: false })
  chatId: string;

  @ManyToOne(() => User, (user) => user.chatMessages, { eager: true })
  user: User;

  @Column()
  text: string;
}
