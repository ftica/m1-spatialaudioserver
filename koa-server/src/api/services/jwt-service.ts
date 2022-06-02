import path from 'path';
import { readFileSync } from 'fs';
import { AccessToken, Role } from '@prisma/client';
import jwt, { Secret, SignOptions, VerifyOptions, Jwt } from 'jsonwebtoken';

export type Payload = { username: string, role: Role }
export type Token = AccessToken & Payload;

const signJwt: (token: Token, secret: Secret, options?: SignOptions) => string = jwt.sign;
const verifyToken: (token: string, secret: Secret, options?: VerifyOptions) => Jwt = jwt.verify;

export class JwtService {
  constructor(
    private readonly privateKey: Buffer,
    private readonly publicKey: Buffer,
    private readonly secret: Secret = { key: privateKey, passphrase: process.env.PRIV_KEY_PASSPHRASE || 'mach1' },
    private readonly signOptions: SignOptions = { algorithm: 'RS256' }
  ) { }

  sign(token: Token): string {
    return signJwt(token, this.secret, this.signOptions);
  }

  verify(token: string): Jwt {
    return verifyToken(token, this.publicKey, { complete: true });
  }
}

export default new JwtService(
  readFileSync(path.resolve(__dirname, '../../auth/dev.key')),
  readFileSync(path.resolve(__dirname, '../../auth/dev.key.pub'))
);
