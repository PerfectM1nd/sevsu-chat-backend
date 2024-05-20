import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @IsString()
  @ApiProperty({ description: 'Title of the chat' })
  title: string;
}
