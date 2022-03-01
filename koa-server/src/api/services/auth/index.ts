export type {
  UserLoginInput,
  UserRegisterInput,
  UserInfo,
  RequestToken
} from './types';

import AuthService from './service';

export type { AuthService };

export default async function getAuthService(): Promise<AuthService> {
  return await AuthService.getInstance();
}
