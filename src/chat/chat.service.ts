import { Injectable, NotFoundException } from '@nestjs/common';
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

    let chat = await this.getChatByUsers(authUser.id, secondUser.id);

    if (!chat) {
      chat = new Chat();
      chat.chatMembers = [authUser, secondUser];
      chat = await this.chatRepository.save(chat);
      chat = await this.getChat(chat.id);
    }

    return chat;
  }

  async getChatByUsers(
    firstUserId: string,
    secondUserId: string,
  ): Promise<Chat | null> {
    const userChatsIds = (
      await this.chatRepository
        .createQueryBuilder('chat')
        .innerJoin('chat.chatMembers', 'chatMember')
        .where('chatMember.id = :firstUserId', { firstUserId })
        .getMany()
    ).map((chat) => chat.id);

    const chatsWithUsers = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.chatMembers', 'chatMember')
      .leftJoinAndSelect('chat.chatMessages', 'chatMessage')
      .leftJoinAndSelect('chatMessage.user', 'user')
      .whereInIds(userChatsIds)
      .getMany();

    for (const chat of chatsWithUsers) {
      for (const user of chat.chatMembers) {
        if (user.id === secondUserId) {
          return chat;
        }
      }
    }

    return null;
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
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['chatMessages', 'chatMessages.user'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat.chatMessages;
  }

  async getChat(id: string): Promise<Chat> {
    return await this.chatRepository.findOne({
      where: { id },
      relations: ['chatMessages', 'chatMessages.user', 'chatMembers'],
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

  async deleteMessage(messageId: string): Promise<void> {
    await this.chatMessageRepository.delete(messageId);
  }

  async deleteChat(chatId: string): Promise<void> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['chatMessages'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    await this.chatMessageRepository.remove(chat.chatMessages);

    await this.chatRepository.remove(chat);
  }
}
