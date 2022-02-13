import * as jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

const privateKey: Buffer = fs.readFileSync(path.resolve(__dirname, 'dev.key'));
const publicKey: Buffer = fs.readFileSync(path.resolve(__dirname, 'dev.key.pub'));

const secret: Secret = {
  key: privateKey,
  passphrase: process.env.PRIV_KEY_PASSPHRASE || 'mach1'
};

const sign = async (payload) => jwt.sign(payload, secret, { algorithm: 'RS256' });
const verify = async (token: string) => jwt.verify(token, publicKey);

export {
  sign,
  verify
};
