export type {
  JwtToken,
  Payload
} from './types';

import JwtService from './service';

export type { JwtService };

export default async function getJwtService(): Promise<JwtService> {
  return await JwtService.getInstance();
}
