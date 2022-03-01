import { AccessToken } from '@prisma/client';

export type UserLoginInput = { username: string, password: string };
export type UserRegisterInput = { username: string, password: string };
export type UserInfo = { username: string, roles: string[] };
export type RequestToken = AccessToken & UserInfo;
