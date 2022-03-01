import { AccessToken, PrismaClient, Role, User } from '@prisma/client';
import encryptionService, { EncryptionService } from './encryption-service';
import jwtService, { JwtService } from './jwt-service';

export type UserLoginInput = { username: string, password: string };
export type UserRegisterInput = { username: string, password: string };
export type UserInfo = { username: string, roles: string[] };
export type TokenData = AccessToken & UserInfo;

export class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService
  ) {}

  private get validUntil() {
    return new Date(Date.now() + (60 * 60));
  }

  private static getRequestToken(value: AccessToken & { user: { username: string, role: Role } }) {
    return {
      id: value.id,
      validUntil: value.validUntil,
      userId: value.userId,
      username: value.user.username,
      roles: [value.user.role]
    };
  }

  private async createToken(prisma: PrismaClient, user: User): Promise<TokenData> {
    return await prisma.accessToken
      .create({
        data: { validUntil: this.validUntil, userId: user.id },
        include: { user: { select: { username: true, role: true } } }
      })
      .then(AuthService.getRequestToken);
  }

  public async login(prisma: PrismaClient, input: UserLoginInput): Promise<string> {
    const user: User = await prisma.user.findUnique({ where: { username: input.username } });
    const passwordCorrect: boolean = await this.encryptionService.verifyPassword(input.password, user.password);

    if (!passwordCorrect) {
      console.log(`${new Date()} Failed login for user ${user.username}#${user.id}`);
      return null;
    }

    const token: TokenData = await this.createToken(prisma, user);

    return await this.jwtService.sign(token);
  }

  public async register(prisma: PrismaClient, input: UserRegisterInput): Promise<User> {
    return await prisma.user
      .create({
        data: {
          username: input.username,
          password: await this.encryptionService.digest(input.password),
          role: Role.USER
        }
      });
  }
}

export default new AuthService(encryptionService, jwtService);

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

//   // eslint-disable-next-line no-useless-constructor
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

//   private async createToken(prisma: PrismaClient, user: User): Promise<RequestToken> {
//     return await prisma.accessToken
//       .create({
//         data: { validUntil: this.validUntil, userId: user.id },
//         include: { user: { select: { username: true, role: true } } }
//       })
//       .then(AuthService.getRequestToken);
//   }

//   public async login(prisma: PrismaClient, input: UserLoginInput): Promise<RequestToken> {
//     const user: User = await prisma.user.findUnique({ where: { username: input.username } });
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

//   const createToken = async (prisma: PrismaClient, user: User): Promise<RequestToken> =>
//     await prisma.accessToken
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

//   export async function login(prisma: PrismaClient, input: UserLoginInput): Promise<string> {
//     const user: User = await prisma.user.findUnique({ where: { username: input.username } });
//     const correctPassword = await verifyPassword(input.password, fromPasswordString(user.password));

//     if (!correctPassword) {
//       console.log(`${new Date()} Failed login for user ${user.username}#${user.id}`);
//       return null;
//     }

//     const token: RequestToken = await createToken(prisma, user);

//     return await sign(token);
//   }

//   export async function register(prisma: PrismaClient, input: UserRegisterInput): Promise<User> {
//     return await prisma.user.create({
//       data: {
//         username: input.username,
//         password: await getDigest(input.password),
//         role: Role.USER
//       }
//     });
//   }
// }
