import { ClsStore } from 'nestjs-cls';
import { User } from '@/users/entities/user.entity';

export interface AuthClsStore extends ClsStore {
  authUser: User;
  tokenPayload: any;
}
