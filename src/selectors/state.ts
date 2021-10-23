import {createSelector} from '@reduxjs/toolkit';
import {RootState, UserAccount} from 'types';
import {Aes, TNBChatAccountManager} from 'utils';

export const getAuthData = (state: RootState) => state.app.auth;

export const getUserAccounts = (state: RootState) => state.app.accounts;

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
