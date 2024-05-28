import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from '@/chat/chat.service';
import { CreateChatDto } from '@/chat/dto/create-chat.dto';
import { AddMemberDto } from '@/chat/dto/add-member.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiCreatedResponse({ description: 'Chat successfully created.' })
  @ApiBody({ type: CreateChatDto, description: 'Chat creation details' })
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
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
  getChatMessages(@Body() chatId: string) {
    return this.chatService.getChatMessages(chatId);
  }

  @Get('my-chats')
  @ApiOperation({ summary: 'Get all chats of the authenticated user' })
  @ApiCreatedResponse({ description: 'Chats successfully retrieved.' })
  getMyChats() {
    return this.chatService.getMyChats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiCreatedResponse({ description: 'Chat successfully retrieved.' })
  getChatById(@Body() id: string) {
    return this.chatService.getChat(id);
  }
}
