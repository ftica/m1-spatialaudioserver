import { readFile } from 'fs/promises';
import path from 'path';
import { AccessToken, Role } from '@prisma/client';
import jwt, { Secret, SignOptions, Jwt } from 'jsonwebtoken';
import { promisify } from 'util';

// export type Header = { }
export type Payload = { 'username': 'PUBLIC', 'roles': Role[] }
export type Token = AccessToken & Payload & object & Jwt;

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

  // private static readonly verifyToken: (token: string, secret: Secret, options?: VerifyOptions) => Promise<Token>
  //   = promisify<Token>(jwt.verify);

  public async sign(payload: Payload): Promise<string> {
    return await JwtService.signJwt(payload, this.secret, this.signOptions);
  }

  // public async verify(token: string): Promise<Token> {
  //   return await JwtService.verifyToken(token, this.publicKey, { complete: false });
}

// const privateKey: string = await fs.readFile('../../auth/dev.key');
// const publicKey: string = await fs.readFile('../../auth/dev.key.pub');

// console.log(privateKey);
// console.log(publicKey);

let jwtService: JwtService = null;

Promise.all([
  readFile(path.resolve(__dirname, '../../auth/dev.key')),
  readFile(path.resolve(__dirname, '../../auth/dev.key.pub'))
]).then(([privateKey, publicKey]) => {
  jwtService = new JwtService(privateKey, publicKey);
});

export default jwtService;
