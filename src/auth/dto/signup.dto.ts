import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto extends CreateUserDto {
  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({ description: 'Username of the user' })
  username: string;

  @ApiProperty({ description: 'Password of the user' })
  password: string;
}
