import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ChatMessage } from '@/chat/entities/chatMessage';
import { BaseEntity } from '@/common/base-entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  lastOnlineTime: Date;

  @Column({ nullable: true })
  gender: boolean;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  chatMessages: ChatMessage[];
}
