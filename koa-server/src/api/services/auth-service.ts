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
    let token: AccessToken = await db.accessToken.findUnique({ where: { id: undefined, userId: user.id } });

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

    const passwordCorrect: boolean = await encryptionService.verifyPassword(input.password, user.password);
    if (!passwordCorrect) {
      console.log(`${now()} Failed login for user ${user.username}#${user.id}`);
      return null;
    }

    const token: Token = await this.getOrCreateToken(user);
    return await jwtService.sign(token);
  }

  async register(input: UserRegisterInput): Promise<User> {
    return await userService.createOne({
      id: undefined,
      lastSeen: undefined,
      username: input.username,
      email: input.email,
      password: await encryptionService.digest(input.password),
      role: Role.USER
    });
  }
}

export default new AuthService();

// // import { verifyPassword, getDigest, fromPasswordString } from '../../auth/auth-utils';
// import { AccessToken, PrismaClient, Role, User } from '@prisma/client';
// import { EncryptionService } from './encryption';

// export type UserLoginInput = { username: string, password: string };
// export type UserRegisterInput = { username: string, password: string };

// type UserInfo = { username: string, roles: string[] };
// type RequestToken = AccessToken & UserInfo;

// export class AuthService {
//   private static INSTANCE: AuthService;

//   public static async getInstance(): Promise<AuthService> {
//     if (!AuthService.INSTANCE) {
//       AuthService.INSTANCE = new AuthService();
//     }

//     return AuthService.INSTANCE;
//   }

//   private get encryption(): Promise<EncryptionService> {
//     return this.encryptionServiceClass.getInstance();
//   }

//   private constructor(
//      private readonly encryptionServiceClass: (typeof EncryptionService) = EncryptionService
//   ) {}

//   private get validUntil() {
//     return new Date(Date.now() + (60 * 60));
//   }

//   private static getRequestToken(value: AccessToken & { user: { username: string, role: Role } }) {
//     return {
//       id: value.id,
//       validUntil: value.validUntil,
//       userId: value.userId,
//       username: value.user.username,
//       roles: [value.user.role]
//     };
//   }

//   private async createToken(ctx: Context, user: User): Promise<RequestToken> {
//     return await db.accessToken
//       .create({
//         data: { validUntil: this.validUntil, userId: user.id },
//         include: { user: { select: { username: true, role: true } } }
//       })
//       .then(AuthService.getRequestToken);
//   }

//   public async login(ctx: Context, input: UserLoginInput): Promise<RequestToken> {
//     const user: User = await db.user.findUnique({ where: { username: input.username } });
//     // const passwordCorrect: boolean = await verifyPassword(input.password, fromPasswordString(user.password));
//     const passwordCorrect: boolean = await this.encryption
//       .then(service => service.verifyPassword(input.password, service.passwordObject(user.password)));

//     if (!passwordCorrect) {
//       console.log(`${new Date()} Failed login for user ${user.username}#${user.id}`);
//       return null;
//     }

//     const token: RequestToken = await this.createToken(prisma, user);

//     return token;
//   }
// }

// export namespace AuthService {
//   export type UserLoginInput = { username: string, password: string };
//   export type UserRegisterInput = { username: string, password: string };

//   type RequestToken = AccessToken & { username: string, roles: string[] }

//   const getValidUntil = () =>
//     new Date(Date.now() + (60 * 60));

//   const createToken = async (ctx: Context, user: User): Promise<RequestToken> =>
//     await db.accessToken
//       .create({
//         data: { validUntil: getValidUntil(), userId: user.id },
//         include: { user: { select: { username: true, role: true } } }
//       })
//       .then(value => ({
//         id: value.id,
//         validUntil: value.validUntil,
//         userId: value.userId,
//         username: value.user.username,
//         roles: [value.user.role]
//       }));

//   export async function login(ctx: Context, input: UserLoginInput): Promise<string> {
//     const user: User = await db.user.findUnique({ where: { username: input.username } });
//     const correctPassword = await verifyPassword(input.password, fromPasswordString(user.password));

//     if (!correctPassword) {
//       console.log(`${new Date()} Failed login for user ${user.username}#${user.id}`);
//       return null;
//     }

//     const token: RequestToken = await createToken(prisma, user);

//     return await sign(token);
//   }

//   export async function register(ctx: Context, input: UserRegisterInput): Promise<User> {
//     return await db.user.create({
//       data: {
//         username: input.username,
//         password: await getDigest(input.password),
//         role: Role.USER
//       }
//     });
//   }
// }
