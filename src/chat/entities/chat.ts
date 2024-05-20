import { BaseEntity } from '@/common/base-entity';
import {
  Column,
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

  @Column()
  title: string;

  @ManyToMany(() => User)
  @JoinTable()
  chatMembers: User[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chat)
  chatMessages: ChatMessage[];
}
