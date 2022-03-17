import path from 'path';
import { readFileSync } from 'fs';
import { AccessToken, Role } from '@prisma/client';
import jwt, { Secret, SignOptions, VerifyOptions, Jwt } from 'jsonwebtoken';

export type Payload = { username: string, role: Role }
export type Token = AccessToken & Payload;

export class JwtService {

  private readonly secret: Secret;

  constructor(
    private readonly privateKey: Buffer,
    private readonly publicKey: Buffer,
    secret?: Secret,
    private readonly signOptions: SignOptions = { algorithm: 'RS256' }
  ) {
    this.secret = secret ?? {
      key: privateKey,
      passphrase: process.env.PRIV_KEY_PASSPHRASE || 'mach1'
    };
  }

  private static readonly signJwt: (token: Token, secret: Secret, options?: SignOptions) => string =
    jwt.sign;

  private static readonly verifyToken: (token: string, secret: Secret, options?: VerifyOptions) => Jwt =
    jwt.verify;

  sign(token: Token): string {
    return JwtService.signJwt(token, this.secret, this.signOptions);
  }

  verify(token: string): Jwt {
    return JwtService.verifyToken(token, this.publicKey, { complete: true });
  }
}

export default new JwtService(
  readFileSync(path.resolve(__dirname, '../../auth/dev.key')),
  readFileSync(path.resolve(__dirname, '../../auth/dev.key.pub'))
);
