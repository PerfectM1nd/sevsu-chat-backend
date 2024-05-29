import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ChatModule } from '@/chat/chat.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ttl: 20,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
      interceptor: {
        mount: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: 'database',
        port: configService.get('POSTGRES_DOCKER_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: ['dist/**/*.entity.{ts,js}'],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
