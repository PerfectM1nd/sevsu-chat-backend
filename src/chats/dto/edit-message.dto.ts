import { IsString } from 'class-validator';

export class EditMessageDto {
  @IsString()
  id: string;

  @IsString()
  text: string;
}
