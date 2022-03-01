import { User } from '@prisma/client';
import { Validator } from 'node-input-validator';

export const userValidator = (user: User) => new Validator(user, {
  username: 'required|minLength:2',
  password: 'required|minLength:8'
});
