import jwt, { Jwt, JwtPayload, Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { promises } from 'fs';
import path from 'path';
import { promisify } from 'util';

export namespace TokenService {
  export type Payload = string | object | Buffer;
  type VerifyResult = string | JwtPayload | Jwt;

  // const privateKey: Buffer;// fs.readFileSync(path.resolve(__dirname, 'dev.key'));
  // const publicKey: Buffer;// fs.readFileSync(path.resolve(__dirname, 'dev.key.pub'));

  // const secret: Secret = {
  //   key: privateKey,
  //   passphrase: process.env.PRIV_KEY_PASSPHRASE || 'mach1'
  // };

  // async function privateKey(): Promise<Buffer> {
  //   return await promises.readFile(path.resolve(__dirname, 'dev.key.pub'));
  // }
  const signOptions: SignOptions = { algorithm: 'RS256' };

  const privateKey: Promise<Buffer> = promises.readFile(path.resolve(__dirname, 'dev.key'));
  const publicKey: Promise<Buffer> = promises.readFile(path.resolve(__dirname, 'dev.key.pub'));
  const secret: Promise<Secret> = (async () => ({
    key: await privateKey,
    passphrase: process.env.PRIV_KEY_PASSPHRASE || 'mach1'
  }))();

  const signJwt: (payload: Payload, secret: Secret, options?: SignOptions) => Promise<string> = promisify(jwt.sign);
  const verifyToken: (token: string, secret: Secret, options?: VerifyOptions) => Promise<string | Jwt | JwtPayload> = promisify(jwt.verify);

  export async function sign(payload: Payload): Promise<string> {
    return await signJwt(payload, await secret, signOptions);
  }

  export async function verify(token: string): Promise<VerifyResult> {
    return await verifyToken(token, await publicKey);
  }
}

// const privateKey: Buffer = fs.readFileSync(path.resolve(__dirname, 'dev.key'));
// const publicKey: Buffer = fs.readFileSync(path.resolve(__dirname, 'dev.key.pub'));
//
// const secret: Secret = {
//   key: privateKey,
//   passphrase: process.env.PRIV_KEY_PASSPHRASE || 'mach1'
// };
//
// const sign = async (payload) => jwt.sign(payload, secret, { algorithm: 'RS256' });
// const verify = async (token: string) => jwt.verify(token, publicKey);
//
// export {
//   sign,
//   verify
// };
