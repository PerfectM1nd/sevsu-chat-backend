import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @ApiProperty({ description: 'Username of the user' })
  username: string;

  @IsString()
  @ApiProperty({ description: 'Password of the user' })
  password: string;
}
