import { promisify } from 'util';
import crypto, { BinaryLike, Encoding } from 'crypto';

export type PasswordObject = {
  algorithm: string,
  iterations: number,
  length: number,
  hash: string,
  salt: string
};

export class EncryptionService {
  private static readonly randomBytes: (size: number) => Promise<Buffer> =
    promisify(crypto.randomBytes);

  private static readonly pbkdf2: (password: BinaryLike, salt: BinaryLike, iterations: number, keyLength: number, digest: string) => Promise<Buffer> =
    promisify(crypto.pbkdf2);

  constructor(
    private readonly algorithm = process.env.PASS_HASH_ALGORITHM || 'sha256',
    private readonly iterations = parseInt(process.env.PASS_HASH_ITERATIONS) || 10000,
    private readonly hashLength = parseInt(process.env.PASS_HASH_LENGTH) || 32,
    private readonly saltBytes = parseInt(process.env.PASS_SALT_BYTES) || 16,
    private readonly encoding = 'base64' as Encoding
  ) {}

  passwordString(algorithm: string, iterations: number, length: number, hash: string, salt: string): string {
    return `${algorithm}:${iterations}:${length}:${hash}:${salt}`;
  }

  passwordObject(password: string): PasswordObject {
    const parts = password.split(':');

    if (parts.length !== 5) return null;

    return {
      algorithm: parts[0],
      iterations: parseInt(parts[1]),
      length: parseInt(parts[2]),
      hash: parts[3],
      salt: parts[4]
    };
  }

  async digest(input: string): Promise<string> {
    const salt: string = await EncryptionService
      .randomBytes(this.saltBytes)
      .then(bytes => bytes.toString(this.encoding));
    const hash = await EncryptionService
      .pbkdf2(input, salt, this.iterations, this.hashLength, this.algorithm)
      .then(bytes => bytes.toString(this.encoding));

    return this.passwordString(this.algorithm, this.iterations, this.hashLength, hash, salt);
  }

  async verifyPassword(input: string, savedPassword: string): Promise<boolean> {
    return await this.verifyPasswordObject(input, this.passwordObject(savedPassword));
  }

  private async verifyPasswordObject(input: string, savedPassword: PasswordObject): Promise<boolean> {
    return await EncryptionService
      .pbkdf2(input, savedPassword.salt, savedPassword.iterations, savedPassword.length, savedPassword.algorithm)
      .then(bytes => bytes.toString(this.encoding))
      .then(newHash => newHash === savedPassword.hash);
  }
}

export default new EncryptionService();
