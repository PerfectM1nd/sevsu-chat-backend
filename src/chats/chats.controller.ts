import { Controller, Post, Body, Patch } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { EditMessageDto } from '@/chats/dto/edit-message.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post('send-message')
  sendMessage(@Body() createChatDto: CreateMessageDto) {
    return this.chatsService.sendMessage(createChatDto);
  }

  @Patch('edit-message')
  updateMessage(@Body() editMessageDto: EditMessageDto) {
    return this.chatsService.editMessage(editMessageDto);
  }
}
