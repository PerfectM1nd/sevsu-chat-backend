import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { CreateUserDto } from '@/users/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getCurrentUser(request: Request): Promise<User> {
    const user = request.user;
    return this.usersRepository.findOne({ where: { id: user.id } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(createUserDTO: CreateUserDto): Promise<User> {
    return this.usersRepository.save(createUserDTO);
  }
}
