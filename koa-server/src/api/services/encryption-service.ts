import { promisify } from 'util';
import crypto, { BinaryLike, Encoding } from 'crypto';

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

export class EncryptionService {
  private static readonly DEFAULT_CONFIG: EncryptionConfig = {
    algorithm: 'sha256',
    iterations: 10000,
    hashLength: 32,
    saltBytes: 16,
    encoding: 'base64'
  };

  private static readonly randomBytes: (size: number) => Promise<Buffer> =
    promisify(crypto.randomBytes);

  private static readonly pbkdf2: (password: BinaryLike, salt: BinaryLike, iterations: number, keyLength: number, digest: string) => Promise<Buffer> =
    promisify(crypto.pbkdf2);

  public passwordString(algorithm: string, iterations: number, length: number, hash: string, salt: string): string {
    return `${algorithm}:${iterations}:${length}:${hash}:${salt}`;
  }

  public constructor(
    private readonly config?: EncryptionConfig
  ) {
    this.config ??= {
      algorithm: process.env.PASS_HASH_ALGORITHM || EncryptionService.DEFAULT_CONFIG.algorithm,
      iterations: parseInt(process.env.PASS_HASH_ITERATIONS) || EncryptionService.DEFAULT_CONFIG.iterations,
      hashLength: parseInt(process.env.PASS_HASH_LENGTH) || EncryptionService.DEFAULT_CONFIG.hashLength,
      saltBytes: parseInt(process.env.PASS_SALT_BYTES) || EncryptionService.DEFAULT_CONFIG.saltBytes,
      encoding: EncryptionService.DEFAULT_CONFIG.encoding
    };
  }

  public passwordObject(password: string): PasswordObject {
    const parts = password.split(':');

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
  }

  public async digest(input: string): Promise<string> {
    const salt: string = await EncryptionService
      .randomBytes(this.config.saltBytes)
      .then(bytes => bytes.toString(this.config.encoding));
    const hash = await EncryptionService
      .pbkdf2(input, salt, this.config.iterations, this.config.hashLength, this.config.algorithm)
      .then(bytes => bytes.toString(this.config.encoding));

    return this.passwordString(
      this.config.algorithm,
      this.config.iterations,
      this.config.hashLength,
      hash,
      salt
    );
  }

  public async verifyPassword(input: string, savedPassword: string): Promise<boolean> {
    return await this.verifyPasswordObject(input, this.passwordObject(savedPassword));
  }

  private async verifyPasswordObject(input: string, savedPassword: PasswordObject): Promise<boolean> {
    return await EncryptionService
      .pbkdf2(input, savedPassword.salt, savedPassword.iterations, savedPassword.length, savedPassword.algorithm)
      .then(bytes => bytes.toString(this.config.encoding))
      .then(newHash => newHash === savedPassword.hash);
  }
}

export default new EncryptionService();
