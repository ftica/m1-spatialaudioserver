import { verifyPassword, getDigest, fromPasswordString } from '../../auth/auth-utils';
import { AccessToken, PrismaClient, Role, User } from '@prisma/client';
import { TokenService } from '../../auth/token';
import sign = TokenService.sign;

export namespace AuthService {
  export type UserLoginInput = { username: string, password: string };
  export type UserRegisterInput = { username: string, password: string };

  const getValidUntil = () =>
    new Date(Date.now() + (60 * 60));

  const createToken = async (prisma: PrismaClient, user: User): Promise<AccessToken> =>
    await prisma.accessToken.create({
      data: {
        validUntil: getValidUntil(),
        userId: user.id
      }
    });

  export async function login(prisma: PrismaClient, input: UserLoginInput): Promise<string> {
    const user: User = await prisma.user.findUnique({ where: { username: input.username } });
    const correctPassword = await verifyPassword(input.password, fromPasswordString(user.password));

    if (!correctPassword) {
      console.log(`${new Date()} Failed login for user ${user.username}#${user.id}`);
      return null;
    }

    const token = await createToken(prisma, user);

    return await sign(token);
  }

  export async function register(prisma: PrismaClient, input: UserRegisterInput): Promise<User> {
    return await prisma.user.create({
      data: {
        username: input.username,
        password: await getDigest(input.password),
        role: Role.USER
      }
    });
  }
}

// const getValidUntil = () => new Date(Date.now() + (60 * 60));
//
// const createToken = async (prisma: PrismaClient, user: User): Promise<AccessToken> => await prisma.accessToken.create({
//   data: {
//     validUntil: getValidUntil(),
//     userId: user.id
//   }
// });
//
// export type UserLoginInput = { username: string, password: string };
//
// const login = async (prisma: PrismaClient, input: UserLoginInput): Promise<string> => {
//   const user: User = await prisma.user.findUnique({ where: { username: input.username } });
//
//   if (!await verifyPassword(input.password, fromPasswordString(user.password))) {
//     console.log('AAAAAAAAAAAAaaaaaaaa');
//     return null;
//   }
//
//   const token = await createToken(prisma, user);
//
//   return await sign(token);
// };
//
// export type UserRegisterInput = { username: string, password: string };
//
// const register = async (prisma: PrismaClient, input: UserRegisterInput): Promise<User> =>
//   await prisma.user
//     .create({
//       data: {
//         username: input.username,
//         password: await getDigest(input.password),
//         role: Role.USER
//       }
//     });
//
// export const AuthService = {
//   login,
//   register
// };
