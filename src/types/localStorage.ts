import {UserAccount, Dict} from 'types';
import {LocalAuthData, SessionAuthData} from './store';

export interface LocalStorageData {
  auth: LocalAuthData;
  user_accounts: Dict<UserAccount>;
}

export type LocalStorageKeys = keyof LocalStorageData;

export interface SessionStorageData {
  auth: SessionAuthData;
}

export type SessionStorageKeys = keyof SessionStorageData;
