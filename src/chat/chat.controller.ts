import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatService } from '@/chat/chat.service';
import { AddMemberDto } from '@/chat/dto/add-member.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateChatMessageDto } from '@/chat/dto/create-chat-message.dto';

@ApiTags('chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('get-or-create/:userId')
  @ApiOperation({ summary: 'Get or create a chat with a user' })
  @ApiCreatedResponse({
    description: 'Chat successfully retrieved or created.',
  })
  getOrCreateChat(@Param('userId') userId: string) {
    return this.chatService.getOrCreateChat(userId);
  }

  @Post('add-member')
  @ApiOperation({ summary: 'Add a member to a chat' })
  @ApiCreatedResponse({ description: 'Member successfully added to the chat.' })
  @ApiBody({
    type: AddMemberDto,
    description: 'Details of the member to be added',
  })
  addMember(@Body() addMemberDto: AddMemberDto) {
    return this.chatService.addMember(addMemberDto.userId, addMemberDto.chatId);
  }

  @Get('messages/:chatId')
  @ApiOperation({ summary: 'Get messages of a chat' })
  @ApiCreatedResponse({ description: 'Messages successfully retrieved.' })
  getChatMessages(@Param('chatId') chatId: string) {
    return this.chatService.getChatMessages(chatId);
  }

  @Get('my-chats')
  @ApiOperation({ summary: 'Get all chats of the authenticated user' })
  @ApiCreatedResponse({ description: 'Chats successfully retrieved.' })
  getMyChats() {
    return this.chatService.getMyChats();
  }

  @Get(':chatId')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiCreatedResponse({ description: 'Chat successfully retrieved.' })
  getChatById(@Param('chatId') chatId: string) {
    return this.chatService.getChat(chatId);
  }

  @Post('send-message')
  @ApiOperation({ summary: 'Create a message in a chat' })
  @ApiCreatedResponse({ description: 'Message successfully created.' })
  @ApiBody({
    type: CreateChatMessageDto,
    description: 'Details of the message to be created',
  })
  createMessage(@Body() createChatMessageDto: CreateChatMessageDto) {
    return this.chatService.createMessage(createChatMessageDto);
  }

  @Delete('messages/:messageId')
  @ApiOperation({ summary: 'Deletes a message from a chat' })
  @ApiCreatedResponse({ description: 'Message successfully deleted.' })
  deleteMessage(@Param('messageId') messageId: string) {
    return this.chatService.deleteMessage(messageId);
  }

  @Delete(':chatId')
  @ApiOperation({ summary: 'Deletes a chat with all related messages' })
  @ApiCreatedResponse({
    description: 'Chat and all related messages successfully deleted.',
  })
  deleteChat(@Param('chatId') chatId: string) {
    return this.chatService.deleteChat(chatId);
  }
}
