import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
  @IsString()
  @ApiProperty({ description: 'User ID of the member to be added' })
  userId: string;

  @IsString()
  @ApiProperty({ description: 'Chat ID where the member will be added' })
  chatId: string;
}
