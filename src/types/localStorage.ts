import {UserAccount, Dict} from 'types';
import {LocalAuthData, SessionAuthData, DirectMessage} from './store';

export interface LocalStorageData {
  auth: LocalAuthData;
  user_accounts: Dict<UserAccount>;
  direct_messages: Dict<Dict<DirectMessage>>;
}

export type LocalStorageKeys = keyof LocalStorageData;

export interface SessionStorageData {
  auth: SessionAuthData;
}

export type SessionStorageKeys = keyof SessionStorageData;
