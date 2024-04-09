import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '@/chats/entities/chat.entity';
import { Message } from '@/chats/entities/message.entity';
import { User } from '@/users/entities/user.entity';
import { getCurrentUser } from '@/auth/auth.storage';
import { EditMessageDto } from '@/chats/dto/edit-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async sendMessage(dto: CreateMessageDto) {
    const currentUser = getCurrentUser();
    let chat = await this.chatsRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'user')
      .where('user.id IN (:...ids)', { ids: [currentUser.id, dto.addresseeId] })
      .getOne();
    if (!chat) {
      const newChat = new Chat();
      const addresseeUser = await this.usersRepository.findOne({
        where: { id: dto.addresseeId },
      });
      newChat.users = [currentUser, addresseeUser];
      chat = await this.chatsRepository.save(newChat);
    }
    const message = new Message();
    message.chat = chat;
    message.text = dto.text;
    message.user = currentUser;
    return this.messagesRepository.save(message);
  }

  async editMessage(dto: EditMessageDto) {
    const message = await this.messagesRepository.findOne({
      where: { id: dto.id },
    });
    message.text = dto.text;
    return this.messagesRepository.save(message);
  }
}
