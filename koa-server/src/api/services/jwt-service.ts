// import { promises as fs } from 'fs';
// import path from 'path';
import jwt, { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { promisify } from 'util';

export type Payload = string | object | Buffer;
export type JwtToken = string | Payload;

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

  private static readonly verifyToken: (token: string, secret: Secret, options?: VerifyOptions) => Promise<JwtToken>
    = promisify(jwt.verify);

  public async sign(payload: Payload): Promise<string> {
    return await JwtService.signJwt(payload, this.secret, this.signOptions);
  }

  public async verify(token: string): Promise<JwtToken> {
    return await JwtService.verifyToken(token, this.publicKey, { complete: false });
  }
}

const privateKey: string = require('../../auth/dev.key');
const publicKey: string = require('../../auth/dev.key');

console.log(privateKey);
console.log(publicKey);

// Promise.all([
//   fs.readFile(path.resolve(__dirname, 'dev.key')),
//   fs.readFile(path.resolve(__dirname, 'dev.key.pub'))
// ]).then(([privateKey, publicKey]) => {
// });

export default new JwtService(Buffer.from(privateKey), Buffer.from(publicKey));
