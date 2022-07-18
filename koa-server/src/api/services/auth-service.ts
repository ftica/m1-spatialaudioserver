import { Role, User } from '@prisma/client';
import { randomBytes } from 'crypto';
import encryptionService from './encryption-service';
import jwtService from './jwt-service';
import userService from './user-service';

export type UserLoginInput = { email: string, password: string };
export type UserRegisterInput = { username: string, email: string, password: string };

export class AuthService {
  static readonly expiresInMilliseconds = 30 /* days */ * 24 /* hours */ * 60 /* minutes */ * 60 /* seconds */ * 1000 /* milliseconds */;

  async login(input: UserLoginInput): Promise<string> {
    const user: User = await userService.findByEmail(input.email);
    if (!user) return null;

    const passwordCorrect = await encryptionService.verify(input.password, user.password);
    if (!passwordCorrect) {
      console.log(`${new Date()} Failed login for user ${user.username}(${user.id})`);
      return null;
    }

    userService.seenNow(user.username);

    return await jwtService.sign({
      jti: randomBytes(16).toString('hex'), // randomUUID() function doesn't exist in Node v14.16.0 and before
      userId: user.id,
      username: user.username,
      role: user.role,
      iat: Date.now()
    });
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
