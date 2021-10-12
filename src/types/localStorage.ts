import {TNBChatAccount} from './user';

export interface StoredUserKeys {
  encrypted_text: string;
  tnbchat_account: TNBChatAccount;
}

export type LocalStorageData = StoredUserKeys;
