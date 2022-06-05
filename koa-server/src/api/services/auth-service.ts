import { AccessToken, Role, User } from '@prisma/client';
import db from '../../koa/db';
import { addSeconds, now } from '../util/time';
import encryptionService from './encryption-service';
import jwtService, { Token } from './jwt-service';
import userService from './user-service';

export type UserLoginInput = { email: string, password: string };
export type UserRegisterInput = { username: string, email: string, password: string };
export type UserInfo = { username: string, role: string };
export type TokenData = AccessToken & UserInfo;

export class AuthService {
  static readonly expiresInSeconds = 60 * 60 * 2;

  private async getOrCreateToken(user: User): Promise<Token> {
    let token: AccessToken = await db.accessToken.findUnique({ where: { userId: user.id } });

    if (token && token.validUntil < now()) {
      await db.accessToken.delete({ where: { id: token.id } });
      token = null;
    }
    if (!token) {
      token = await db.accessToken.create({ data: { userId: user.id, validUntil: addSeconds(now(), AuthService.expiresInSeconds) } });
    }

    return {
      id: token.id,
      userId: user.id,
      validUntil: token.validUntil,
      username: user.username,
      role: user.role
    };
  }

  async login(input: UserLoginInput): Promise<string> {
    const user: User = await userService.findByEmail(input.email);
    if (!user) return null;

    const passwordCorrect = await encryptionService.verify(input.password, user.password);
    if (!passwordCorrect) {
      console.log(`${now()} Failed login for user ${user.username}#${user.id}`);
      return null;
    }

    const token: Token = await this.getOrCreateToken(user);
    return await jwtService.sign(token);
  }

  async register(input: UserRegisterInput): Promise<User> {
    return await userService.createOne({
      lastSeen: undefined,
      username: input.username,
      email: input.email,
      password: await encryptionService.digest(input.password),
      role: Role.USER
    });
  }
}

export default new AuthService();
