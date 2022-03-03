import path from 'path';
import { readFileSync } from 'fs';
import { AccessToken, Role } from '@prisma/client';
import { promisify } from 'util';
import jwt, { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';

export type Payload = { 'username': string, 'role': Role }
export type Token = AccessToken & Payload;

export class JwtService {
  public constructor(
    private readonly privateKey: Buffer,
    private readonly publicKey: Buffer,
    private readonly secret?: Secret,
    private readonly signOptions: SignOptions = { algorithm: 'RS256' }
  ) {
    this.secret ??= {
      key: privateKey,
      passphrase: process.env.PRIV_KEY_PASSPHRASE || 'mach1'
    };
  }

  private static readonly signJwt: (payload: Payload, secret: Secret, options?: SignOptions) => Promise<string>
    = promisify(jwt.sign);

  private static readonly verifyToken: (token: string, secret: Secret, options?: VerifyOptions) => Promise<object>
    = promisify(jwt.verify);

  public async sign(payload: Payload): Promise<string> {
    return await JwtService.signJwt(payload, this.secret, this.signOptions);
  }

  public async verify(token: string): Promise<object> {
    return await JwtService.verifyToken(token, this.publicKey, { complete: false });
  }
}

export default new JwtService(
  readFileSync(path.resolve(__dirname, '../../auth/dev.key')),
  readFileSync(path.resolve(__dirname, '../../auth/dev.key.pub'))
);
