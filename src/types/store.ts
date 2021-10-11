import store from 'store';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export enum AuthStatus {
  create_account = 'CREATE_ACCOUNT',
  register_password = 'REGISTER_PASSWORD',
  import_account = 'IMPORT_ACCOUNT',
  verify_password = 'VERIFY_PASSWORD',
  none = 'NONE',
}

export interface AuthDataStore {
  isLoggedIn: boolean;
  showAuthModal: boolean;
  authStatus: AuthStatus;
  passwordHash: string | null;
}
