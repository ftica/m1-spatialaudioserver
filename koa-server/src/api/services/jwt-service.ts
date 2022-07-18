import path from 'path';
import { readFileSync } from 'fs';
import { Role } from '@prisma/client';
import jwt, { Secret, SignOptions, VerifyOptions, Jwt, JwtPayload } from 'jsonwebtoken';
import paths from '../util/paths';

export type TokenPayload = JwtPayload & {
  jti: string,
  userId: string,
  username: string,
  role: Role
};

const signJwt: (token: TokenPayload | string, secret: Secret, options?: SignOptions) => string = jwt.sign;
const verifyToken: (token: string, secret: Secret, options?: VerifyOptions) => Jwt = jwt.verify;

export class JwtService {
  constructor(
    private readonly privateKey: Buffer,
    private readonly publicKey: Buffer,
    private readonly secret: Secret = { key: privateKey, passphrase: process.env.PRIV_KEY_PASSPHRASE || 'mach1' },
    private readonly signOptions: SignOptions = { algorithm: 'RS256' }
  ) { }

  sign(token: TokenPayload | string): string {
    return signJwt(token, this.secret, this.signOptions);
  }

  verify(token: string): Jwt {
    return verifyToken(token, this.publicKey, { complete: true });
  }
}

export default new JwtService(
  readFileSync(path.join(paths.authFolder, 'dev.key')),
  readFileSync(path.join(paths.authFolder, 'dev.key.pub'))
);
