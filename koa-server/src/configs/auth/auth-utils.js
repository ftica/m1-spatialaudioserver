import crypto from 'crypto';
import { promisify } from 'util';

const randomBytes = promisify(crypto.randomBytes);
const pbkdf2 = promisify(crypto.pbkdf2);

const DEFAULT_CONFIG = {
  algorithm: 'sha256',
  iterations: 10000,
  hashLength: 32,
  saltBytes: 16,
  encoding: 'base64'
};

const config = {
  algorithm: process.env.PASS_HASH_ALGORITHM || DEFAULT_CONFIG.algorithm,
  iterations: process.env.PASS_HASH_ITERATIONS || DEFAULT_CONFIG.iterations,
  hashLength: process.env.PASS_HASH_LENGTH || DEFAULT_CONFIG.hashLength,
  saltBytes: process.env.PASS_SALT_BYTES || DEFAULT_CONFIG.saltBytes,
  encoding: DEFAULT_CONFIG.encoding
};

const toPasswordString = (algorithm, iterations, length, hash, salt) => `${algorithm}:${iterations}:${length}:${hash}:${salt}`;
const fromPasswordString = (pass) => {
  const parts = pass.split(':');

  if (parts.length !== 5) {
    return null;
  }

  return {
    algorithm: parts[0],
    iterations: parts[1],
    length: parts[2],
    hash: parts[3],
    salt: parts[4]
  };
};

const getDigest = async (input) => {
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

const verifyPassword = async (input, savedPassword) => {
  if (
    !savedPassword.salt
    || !savedPassword.hash
    || !savedPassword.iterations
    || !savedPassword.hashLength
    || !savedPassword.algorithm
  ) {
    return false;
  }

  const newHash = (await pbkdf2(
    input,
    savedPassword.salt,
    savedPassword.iterations,
    savedPassword.hashLength,
    savedPassword.algorithm
  )).toString(config.encoding);

  return newHash === savedPassword.hash;
};

const ROLE_USER = 'user';
const ROLE_ADMIN = 'admin';

export {
  toPasswordString,
  fromPasswordString,
  getDigest,
  verifyPassword,
  ROLE_USER,
  ROLE_ADMIN
};
