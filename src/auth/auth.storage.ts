import { User } from '@/users/entities/user.entity';
import { NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

export class RequestContext {
  user: User;
  tokenPayload: any;
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();
export const getCurrentUser = () => asyncLocalStorage.getStore().user;
export const getCurrentTokenPayload = () =>
  asyncLocalStorage.getStore().tokenPayload;

export function asyncLocalStorageMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  asyncLocalStorage.enterWith(new RequestContext());
  next();
}
