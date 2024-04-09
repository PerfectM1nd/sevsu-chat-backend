import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  text: string;

  @IsString()
  addresseeId: string;

  @IsString()
  @IsOptional()
  replyToId?: string;
}
