import {UserAccount, Dict} from 'types';
import {LocalAuthData, SessionAuthData} from './store';
import {USER_ACCOUNTS} from 'constant';

export interface LocalStorageData {
  auth: LocalAuthData;
  user_accounts: Dict<UserAccount>;
}

export type LocalStorageKeys = keyof LocalStorageData;

export interface SessionStorageData {
  auth: SessionAuthData;
}

export type SessionStorageKeys = keyof SessionStorageData;
