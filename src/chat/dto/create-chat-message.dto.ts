import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatMessageDto {
  @IsString()
  @ApiProperty({ description: 'Text of the chat message' })
  text: string;

  @IsString()
  @ApiProperty({ description: 'Chat ID where the message will be posted' })
  chatId: string;
}
