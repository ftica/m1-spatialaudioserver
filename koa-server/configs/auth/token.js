import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const privateKey = fs.readFileSync(path.resolve(__dirname, 'dev.key'));
const publicKey = fs.readFileSync(path.resolve(__dirname, 'dev.key.pub'));

const secret = {
  key: privateKey,
  passphrase: process.env.PRIV_KEY_PASSPHRASE || 'mach1',
};

const sign = async (payload) => jwt.sign(payload, secret, { algorithm: 'RS256' });
const verify = async (token) => jwt.verify(token, publicKey);

export {
  sign,
  verify,
};
