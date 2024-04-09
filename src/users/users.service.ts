import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  create(createUserDTO: CreateUserDto): Promise<User> {
    return this.usersRepository.save(createUserDTO);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findByFullName(fullName: string): Promise<User[]> {
    return this.usersRepository.find({ where: { fullName } });
  }

  async getOnlineUsers(): Promise<User[]> {
    const users = await this.findAll();
    const onlineUsers: User[] = [];

    for (const user of users) {
      if (await this.isUserOnline(user.username)) {
        onlineUsers.push(user);
      }
    }

    return onlineUsers;
  }

  async isUserOnline(username: string): Promise<{ isOnline: boolean }> {
    const isOnline = await this.cacheManager.get('online:' + username);
    return {
      isOnline: !!isOnline,
    };
  }
}
