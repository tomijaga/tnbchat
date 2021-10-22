import store from 'store';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Auth
export interface LocalAuthData {
  encryptedSafetyText: string;
  encryptedSeedPhrase: string;
  derivedAccountsNum: number;
  selectedAccount: string;
}

export interface SessionAuthData {
  appEncryptedUserPasswordHash: string;
}

export enum AuthStatus {
  create_account = 'CREATE_ACCOUNT',
  register_password = 'REGISTER_PASSWORD',
  import_account = 'IMPORT_ACCOUNT',
  verify_password = 'VERIFY_PASSWORD',
  none = 'NONE',
}

export interface AuthStateData {
  isLoggedIn: boolean;
  hasCreatedSeedPhrase: boolean;
  showAuthModal: boolean;
  showManageAccountsModal: boolean;
  autoLockTimeoutId: NodeJS.Timeout;
  authStatus: AuthStatus;
}

export type AuthData = AuthStateData & SessionAuthData & LocalAuthData;
