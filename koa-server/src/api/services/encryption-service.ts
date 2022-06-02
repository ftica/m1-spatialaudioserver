import { promisify } from 'util';
import crypto, { BinaryLike, Encoding } from 'crypto';

export type EncryptionOptions = {
  algorithm: string,
  iterations: number,
  hashLength: number,
  saltLength?: number,
  encoding?: Encoding
}

export type EncryptedPassword = EncryptionOptions & {
  hash: string,
  salt: string,
}

const pbkdf2: (password: BinaryLike, salt: BinaryLike, iterations: number, keyLength: number, digest: string) => Promise<Buffer> =
  promisify(crypto.pbkdf2);

export class EncryptionService {
  constructor(
    private readonly options: EncryptionOptions = {
      algorithm: process.env.PASS_HASH_ALGORITHM || 'sha256',
      iterations: parseInt(process.env.PASS_HASH_ITERATIONS) || 10000,
      hashLength: parseInt(process.env.PASS_HASH_LENGTH) || 32,
      saltLength: parseInt(process.env.PASS_SALT_BYTES) || 16,
      encoding: 'base64' as Encoding
    }
  ) {}

  async encrypt(rawPassword: string, options: EncryptionOptions & { salt?: string } = this.options): Promise<EncryptedPassword> {
    const encoding = options.encoding ?? this.options.encoding;
    const salt = options.salt ?? crypto.randomBytes(options.saltLength).toString(encoding);
    const hash = await pbkdf2(rawPassword, salt, options.iterations, options.hashLength, options.algorithm).then(h => h.toString(encoding));
    return { ...options, hash, salt };
  }

  async digest(rawPassword: string) {
    return await this.encrypt(rawPassword).then(this.packPassword);
  }

  async verify(testPassword: string, realPassword: string) {
    const unpackedRealPassword = this.unpackPassword(realPassword);
    const encryptedTestPassword = await this.encrypt(testPassword, unpackedRealPassword);
    return encryptedTestPassword.hash === unpackedRealPassword.hash;
  }

  packPassword(pass: EncryptedPassword) {
    return `${pass.algorithm}:${pass.iterations}:${pass.hashLength}:${pass.hash}:${pass.salt}`;
  }

  unpackPassword(password: string): EncryptedPassword {
    const parts = password.split(':');

    if (parts.length !== 5) return null;

    return {
      algorithm: parts[0],
      iterations: parseInt(parts[1]),
      hashLength: parseInt(parts[2]),
      hash: parts[3],
      salt: parts[4]
    };
  }
}

export default new EncryptionService();
