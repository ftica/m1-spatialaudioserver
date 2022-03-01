import { Encoding } from 'crypto';

export type EncryptionConfig = {
  algorithm: string,
  iterations: number,
  hashLength: number,
  saltBytes: number,
  encoding: Encoding
};

export type PasswordObject = {
  algorithm: string,
  iterations: number,
  length: number,
  hash: string,
  salt: string
};
