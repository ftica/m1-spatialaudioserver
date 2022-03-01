import { promises as fs } from 'fs';
import path from 'path';
import jwt, { DecodeOptions, Jwt, Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { promisify } from 'util';
import { Payload, JwtToken } from './types';

export default class JwtService {
  private static INSTANCE: JwtService;

  public static async getInstance(): Promise<JwtService> {
    if (!JwtService.INSTANCE)
      JwtService.INSTANCE = new JwtService(
        await fs.readFile(path.resolve(__dirname, 'dev.key')),
        await fs.readFile(path.resolve(__dirname, 'dev.key.pub'))
      );

    return JwtService.INSTANCE;
  }

  private constructor(
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
  private static readonly verifyToken: (token: string, secret: Secret, options?: VerifyOptions) => Promise<JwtToken>
    = promisify(jwt.verify);

  public async sign(payload: Payload): Promise<string> {
    return await JwtService.signJwt(payload, this.secret, this.signOptions);
  }

  public async verify(token: string): Promise<JwtToken> {
    return await JwtService.verifyToken(token, this.publicKey, { complete: false });
  }

}
