import { BaseEntity } from '@/common/base-entity';
import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { ChatMessage } from '@/chat/entities/chatMessage';

@Entity('chats')
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  chatMembers: User[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chat, {
    eager: true,
  })
  chatMessages: ChatMessage[];
}
