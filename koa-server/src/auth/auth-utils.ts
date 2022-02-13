import * as crypto from 'crypto';
import { Encoding } from 'crypto';
import { promisify } from 'util';

const randomBytes = promisify(crypto.randomBytes);
const pbkdf2 = promisify(crypto.pbkdf2);

type ConfigType = {
  algorithm: string,
  iterations: number,
  hashLength: number,
  saltBytes: number,
  encoding: Encoding
};

const DEFAULT_CONFIG: ConfigType = {
  algorithm: 'sha256',
  iterations: 10000,
  hashLength: 32,
  saltBytes: 16,
  encoding: 'base64'
};

const config: ConfigType = {
  algorithm: process.env.PASS_HASH_ALGORITHM || DEFAULT_CONFIG.algorithm,
  iterations: parseInt(process.env.PASS_HASH_ITERATIONS) || DEFAULT_CONFIG.iterations,
  hashLength: parseInt(process.env.PASS_HASH_LENGTH) || DEFAULT_CONFIG.hashLength,
  saltBytes: parseInt(process.env.PASS_SALT_BYTES) || DEFAULT_CONFIG.saltBytes,
  encoding: DEFAULT_CONFIG.encoding
};

const toPasswordString = (algorithm: string, iterations: number, length: number, hash: string, salt: string) =>
  `${algorithm}:${iterations}:${length}:${hash}:${salt}`;

type PasswordObject = {
  algorithm: string,
  iterations: number,
  length: number,
  hash: string,
  salt: string
};

const fromPasswordString = (pass: string): PasswordObject => {
  const parts = pass.split(':');

  if (parts.length !== 5) {
    return null;
  }

  return {
    algorithm: parts[0],
    iterations: parseInt(parts[1]),
    length: parseInt(parts[2]),
    hash: parts[3],
    salt: parts[4]
  };
};

const getDigest = async (input: string) => {
  const salt = (await randomBytes(config.saltBytes)).toString(config.encoding);
  const hash = (await pbkdf2(
    input,
    salt,
    config.iterations,
    config.hashLength,
    config.algorithm
  )).toString(config.encoding);

  return toPasswordString(
    config.algorithm,
    config.iterations,
    config.hashLength,
    hash,
    salt
  );
};

const verifyPassword = async (input: string, savedPassword: PasswordObject): Promise<boolean> => {
  console.log(input);
  console.log(savedPassword);

  // if (
  //   !savedPassword.salt ||
  //   !savedPassword.hash ||
  //   !savedPassword.iterations ||
  //   !savedPassword.hashLength ||
  //   !savedPassword.algorithm
  // ) {
  //   return false;
  // }

  const newHash = (await pbkdf2(
    input,
    savedPassword.salt,
    savedPassword.iterations,
    savedPassword.length,
    savedPassword.algorithm
  )).toString(config.encoding);

  console.log(newHash);

  return newHash === savedPassword.hash;
};

const ROLE_USER = 'USER';
const ROLE_ADMIN = 'ADMIN';

export {
  toPasswordString,
  fromPasswordString,
  getDigest,
  verifyPassword,
  ROLE_USER,
  ROLE_ADMIN
};
