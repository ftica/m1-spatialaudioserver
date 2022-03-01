import { AccessToken, PrismaClient, Role, User } from '@prisma/client';
import { TokenData, UserLoginInput, UserRegisterInput } from './types';
import getEncryptionService, { EncryptionService } from '../encryption';
import getJwtService, { JwtService } from '../jwt';

export default class AuthService {
  private static INSTANCE: AuthService;

  public static async getInstance(): Promise<AuthService> {
    if (!AuthService.INSTANCE)
      AuthService.INSTANCE = new AuthService(
        await getEncryptionService(),
        await getJwtService()
      );

    return AuthService.INSTANCE;
  }

  private constructor(
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService
  ) {
  }

  private get validUntil() {
    return new Date(Date.now() + (60 * 60))
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
        include: {user: {select: {username: true, role:true}}}
      })
      .then(AuthService.getRequestToken)
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
