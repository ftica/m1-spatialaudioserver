export type {
  EncryptionConfig,
  PasswordObject
} from './types';

import EncryptionService from './service';

export type { EncryptionService };

export default async function getEncryptionService(): Promise<EncryptionService> {
  return await EncryptionService.getInstance();
}
