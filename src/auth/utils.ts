import { hash } from 'bcrypt';

export const hashPassword = async (password: string) => {
  return hash(password, 10);
};
