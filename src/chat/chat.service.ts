import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '@/chat/entities/chat';
import { Repository } from 'typeorm';
import { ChatMessage } from '@/chat/entities/chatMessage';
import { CreateChatDto } from '@/chat/dto/create-chat.dto';
import { CreateChatMessageDto } from '@/chat/dto/create-chat-message.dto';
import { UsersService } from '@/users/users.service';
import { AuthClsStore } from '@/cls.store';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    private usersService: UsersService,
    private readonly cls: ClsService<AuthClsStore>,
  ) {}

  async createMessage(
    createChatMessageDto: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    const user = this.cls.get('authUser');
    const chat = await this.findById(createChatMessageDto.chatId);
    const chatMessage = new ChatMessage();
    chatMessage.text = createChatMessageDto.text;
    chatMessage.chat = chat;
    chatMessage.user = user;
    const createdChatMessage = this.chatMessageRepository.create(chatMessage);
    return await this.chatMessageRepository.save(createdChatMessage);
  }

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = new Chat();
    chat.title = createChatDto.title;
    const createdChat = this.chatRepository.create(chat);
    return this.chatRepository.save(createdChat);
  }

  async addMember(userId: string, chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['chatMembers'],
    });
    const user = await this.usersService.findById(userId);

    chat.chatMembers.push(user);
    return this.chatRepository.save(chat);
  }

  async findById(id: string): Promise<Chat> {
    return this.chatRepository.findOne({ where: { id } });
  }

  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    return await this.chatMessageRepository.find({
      where: { chat: { id: chatId } },
    });
  }

  async getChat(id: string): Promise<Chat> {
    return await this.chatRepository.findOne({
      where: { id },
      relations: ['chatMessages', 'chatMembers'],
    });
  }
}
