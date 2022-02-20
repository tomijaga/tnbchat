import {createSelector} from '@reduxjs/toolkit';
import {RootState, UserAccount} from 'types';
import {getAuthData, getUserAccounts} from './state';
import {Aes, TNBChatAccountManager} from 'utils';

export const getUserAccount = createSelector(
  [getUserAccounts, getAuthData],
  (accounts, {local: {selectedAccount}}): UserAccount | null => {
    if (selectedAccount) {
      return accounts[selectedAccount];
    }
    return null;
  },
);

export const getUserAccountManager = createSelector(
  [getUserAccount, getAuthData],
  (account, {session: {appEncryptedUserPasswordHash}}) => {
    if (account && appEncryptedUserPasswordHash) {
      const cypherAlgorithm = new Aes({hash: appEncryptedUserPasswordHash});
      const decryptedSigningKey = cypherAlgorithm.textDecryption(account.encrypted_signing_key);

      return new TNBChatAccountManager(decryptedSigningKey, 'testnet');
    }
  },
);
