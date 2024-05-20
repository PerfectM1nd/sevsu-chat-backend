import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'Username of the user' })
  username: string;

  @IsString()
  @ApiProperty({ description: 'Password of the user' })
  password: string;

  @IsEmail()
  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Full name of the user' })
  fullName: string;
}
