import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '@/chat/entities/chat';
import { Repository } from 'typeorm';
import { ChatMessage } from '@/chat/entities/chatMessage';
import { CreateChatMessageDto } from '@/chat/dto/create-chat-message.dto';
import { UsersService } from '@/users/users.service';
import { AuthClsStore } from '@/cls.store';
import { ClsService } from 'nestjs-cls';
import { ChatGateway } from '@/chat/chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    private usersService: UsersService,
    private readonly cls: ClsService<AuthClsStore>,
    private chatGateway: ChatGateway,
  ) {}

  async createMessage(
    createChatMessageDto: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    const tokenPayload = this.cls.get('authUser');
    const user = await this.usersService.findById(tokenPayload.id);
    const chat = await this.findById(createChatMessageDto.chatId);
    const chatMessage = new ChatMessage();
    chatMessage.text = createChatMessageDto.text;
    chatMessage.chat = chat;
    chatMessage.user = user;
    const createdChatMessage = this.chatMessageRepository.create(chatMessage);
    const savedMessage = await this.chatMessageRepository.save(
      createdChatMessage,
    );
    this.chatGateway.server.emit('receiveMessage', savedMessage);
    return savedMessage;
  }

  async getOrCreateChat(userId: string): Promise<Chat> {
    const authUser = this.cls.get('authUser');
    const secondUser = await this.usersService.findById(userId);

    let chat = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.chatMembers', 'chatMember')
      .leftJoinAndSelect('chat.chatMessages', 'chatMessages')
      .where('chatMember.id IN (:...ids)', {
        ids: [authUser.id, secondUser.id],
      })
      .getOne();

    if (!chat) {
      chat = new Chat();
      chat.chatMembers = [authUser, secondUser];
      await this.chatRepository.save(chat);
    }

    return chat;
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

  async getMyChats(): Promise<Chat[]> {
    const user = this.cls.get('authUser');

    return await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.chatMembers', 'chatMember')
      .leftJoinAndSelect('chat.chatMessages', 'chatMessage')
      .leftJoinAndSelect('chatMessage.user', 'user') // Join chatMessage.user
      .where('chatMember.id = :userId', { userId: user.id })
      .getMany();
  }
}
