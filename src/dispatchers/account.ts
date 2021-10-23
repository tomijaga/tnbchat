import {mainnetBank, testnetBank} from 'api/node';
import {setStateAuthData, setUserAccounts, setLocalAuthData, unsetUserAccount, clearUserAccounts} from 'store/app';
import {Account} from 'packages/thenewboston/src';
import {HdWallet} from 'tnb-hd-wallet';
import {AppDispatch, Dict, RootState, UserAccount} from 'types';
import {Aes, getPfp} from 'utils';
import {getCypherAlgorithm, verifyAuth} from './auth';

export const createSeedPhrase = (seedPhrase: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  const cypherAlgorithm = dispatch(getCypherAlgorithm);

  const encryptedSeedPhrase = cypherAlgorithm?.textEncryption(seedPhrase);

  dispatch(
    setLocalAuthData({
      encryptedSeedPhrase: encryptedSeedPhrase,
      derivedAccountsNum: 0,
    }),
  );

  dispatch(createAccount);

  dispatch(
    setStateAuthData({
      hasCreatedSeedPhrase: true,
    }),
  );
};

// Derives Account from Seed Phrase
export function createAccount(dispatch: AppDispatch, getState: () => RootState) {
  const {
    app: {auth, accounts},
  } = getState();

  if (Object.keys(accounts).length >= 5) throw new Error("You can't Create or Import more than 5 Accounts");
  const aes = new Aes({hash: auth.session.appEncryptedUserPasswordHash!});

  if (auth.local.encryptedSeedPhrase) {
    const seedPhrase = aes.textDecryption(auth.local.encryptedSeedPhrase);

    const hd = HdWallet.thenewboston(seedPhrase);

    //starts from 0
    const addressIndex = auth.local.derivedAccountsNum;

    const {publicKey, privateKey, path} = hd.getAddress(0, addressIndex);

    const newAccount: UserAccount = {
      account_number: publicKey,
      encrypted_signing_key: aes.textEncryption(privateKey),
      is_derived: true,
      path,
      pfp: getPfp(publicKey),
      username: `User-${publicKey.slice(0, 4)}`,
      testnet_balance: 0,
      mainnet_balance: 0,
    };
    dispatch(setUserAccounts(newAccount));
    dispatch(
      setLocalAuthData({
        derivedAccountsNum: addressIndex + 1,
        selectedAccount: publicKey,
      }),
    );

    return newAccount;
  }
}

export const importAccount =
  ({signingKey}: {signingKey: string}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      app: {auth, accounts},
    } = getState();

    if (Object.keys(accounts).length >= 5) throw new Error("You can't Create or Import more than 5 Accounts");

    if (signingKey && signingKey.length === 64) {
      const aes = new Aes({hash: auth.session.appEncryptedUserPasswordHash!});

      const encrypted_signing_key = aes.textEncryption(signingKey);

      const account = new Account(signingKey);
      const accountNumber = account.accountNumberHex;

      dispatch(
        setUserAccounts({
          account_number: accountNumber,
          encrypted_signing_key,
          is_derived: false,
          username: `User-${accountNumber.slice(0, 4)}`,
          pfp: getPfp(accountNumber),
          testnet_balance: 0,
          mainnet_balance: 0,
        }),
      );

      dispatch(
        setLocalAuthData({
          derivedAccountsNum: auth.local.derivedAccountsNum + 1,
          selectedAccount: accountNumber,
        }),
      );
    }
  };

export const switchUserAccount = (accountNumber: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  const {
    app: {accounts},
  } = getState();

  if (accounts[accountNumber]) {
    dispatch(
      setLocalAuthData({
        selectedAccount: accountNumber,
      }),
    );
  }
};

export const removeUserAccount = (accountNumber: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  if (dispatch(verifyAuth)) {
    dispatch(unsetUserAccount(accountNumber));

    const {
      app: {accounts},
    } = getState();

    const firstAccountKey = Object.keys(accounts)[0] ?? '';

    dispatch(
      setLocalAuthData({
        selectedAccount: firstAccountKey,
      }),
    );

    return true;
  }
};

export const removeAllUserAccounts = (dispatch: AppDispatch, getState: () => RootState) => {
  if (dispatch(verifyAuth)) {
    console.log('entered Remove All Accounts');
    dispatch(clearUserAccounts());
  }
};

export const storeAccountCoins =
  (accountNumber: string, {mainnet, testnet}: Dict<number>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const {
      app: {accounts},
    } = getState();

    const account = accounts[accountNumber];
    if (account) {
      // console.log({mainnet, testnet});
      const accountWithNewData: UserAccount = {
        ...account,
        mainnet_balance: mainnet ?? account.mainnet_balance,
        testnet_balance: testnet ?? account.testnet_balance,
      };
      dispatch(setUserAccounts(accountWithNewData));
    }
  };

export const fetchAndStoreAccountBalance =
  (accountNumber: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const testnetPV = await testnetBank.getBankPV();
    const testnet = (await testnetPV.getAccountBalance(accountNumber)).balance ?? 0;

    const mainnetPV = await mainnetBank.getBankPV();
    const mainnet = (await mainnetPV.getAccountBalance(accountNumber)).balance ?? 0;
    dispatch(storeAccountCoins(accountNumber, {testnet, mainnet}));

    return {testnet, mainnet};
  };
