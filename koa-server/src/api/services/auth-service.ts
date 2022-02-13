import { verifyPassword, getDigest } from '../../configs/auth/auth-utils';
import { AccessToken, PrismaClient, Role, User } from '@prisma/client';

const getValidUntil = () => new Date(Date.now() + (60 * 60));

const createToken = async (prisma: PrismaClient, user: User): Promise<AccessToken> => await prisma.accessToken.create({
  data: {
    validUntil: getValidUntil(),
    user: { connect: user }
  }
});

export type UserLoginInput = { username: string, password: string };

const login = async (prisma: PrismaClient, input: UserLoginInput): Promise<AccessToken> => {
  const user: User = await prisma.user.findUnique({ where: { username: input.username } });

  if (!await verifyPassword(input.password, user.password)) {
    return null;
  }

  return await createToken(prisma, user);
};

export type UserRegisterInput = { username: string, password: string };

const register = async (prisma: PrismaClient, input: UserRegisterInput): Promise<User> =>
  await prisma.user
    .create({
      data: {
        username: input.username,
        password: await getDigest(input.password),
        role: Role.USER
      }
    });

// type UserServiceType = {
//   login: (prisma: PrismaClient, input: UserLoginInput) => Promise<AccessToken>,
//   register: (prisma: PrismaClient, input: UserRegisterInput) => Promise<AccessToken>
// }

export const AuthService = {
  login,
  register
};

//     new AuthUser({d
//   email,
//   password,
//   roles: [ROLE_USER]
// }).save();

// const changeRole = async (db, id, newRole) => {
//
// };

// export {
//   login,
//   register
// };
