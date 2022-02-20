import store from 'store';
import {MessageData} from 'api/message';
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

export interface RetrievedPaginationData {
  sent: {start: number; end: number};
  received: {start: number; end: number};
}

// messages
export interface DirectMessage {
  recipient: string;
  contents: MessageData[];
  last_viewed_date: number;
  retrieved_data?: RetrievedPaginationData;
}
