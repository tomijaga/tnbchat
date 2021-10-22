export {};
// import {Account} from 'thenewboston/src';
// import {HdWallet} from 'tnb-hd-wallet';
// import {LocalAuthData, TNBChatAccount, UserAccount} from 'types';
// import {Aes} from 'utils';
// import {LocalStorage} from './localStorage';

// class AccountManager {
//   public localStore: LocalStorage;
//   private cypherAlgorithm: Aes;

//   constructor(login: Partial<{password: string; hash: string}>) {
//     this.localStore = new LocalStorage();
//     this.cypherAlgorithm = new Aes(login);
//   }

//   addSeedPhrase(seedPhrase: string, username?: string) {
//     if (seedPhrase && seedPhrase.split(' ').length === 12) {
//       let accountsData = this.localStore.getItem<TNBChatAccount>('user_accounts');

//       const seed_phrase_hash = this.cypherAlgorithm.textEncryption(seedPhrase);

//       if (accountsData !== null) {
//         accountsData.seed_phrase_hash = seed_phrase_hash;
//       } else {
//         accountsData = {
//           seed_phrase_hash: seed_phrase_hash,
//           num_of_imported_accounts: 0,
//           accounts: [],
//         };
//       }

//       this.localStore.setItem('user_accounts', accountsData);

//       if (username) {
//         this.generateAddress(username);
//       }
//     }
//   }

//   importAddress(signingKey: string, username: string) {
//     if (signingKey.length === 64) {
//       let accountsData = this.localStore.getItem<TNBChatAccount>('user_accounts')!;

//       const newAddressData: UserAccount = {
//         account_number: new Account(signingKey).accountNumberHex,
//         username,
//         encrypted_signing_key: this.cypherAlgorithm.textEncryption(signingKey),
//         is_derived: false,
//       };

//       accountsData.num_of_imported_accounts += 1;
//       accountsData.accounts.push(newAddressData);

//       this.localStore.setItem('user_accounts', accountsData);
//     }
//   }

//   // High security clearance. Need the user to enter
//   // password again becuase all data will be deleted
//   deleteAllAccountData(password: string) {
//     if (password) {
//       const aes = new Aes({password});

//       if (
//         aes.textDecryption(this.localStore.getItem<LocalAuthData>('auth')?.encryptedSafetyText!) ===
//         process.env.REACT_APP_SAFETY_TEXT
//       ) {
//         localStorage.clear();
//       }
//     }
//   }

//   generateAddress(username: string) {
//     let accountsData = this.localStore.getItem<TNBChatAccount>('user_accounts')!;

//     const decrypted_seed_phrase = this.cypherAlgorithm.textDecryption(accountsData.seed_phrase_hash);

//     const {path, publicKey, privateKey} = HdWallet.thenewboston(decrypted_seed_phrase).getAddress(0, 0);

//     const newAddressData: UserAccount = {
//       account_number: publicKey,
//       username,
//       encrypted_signing_key: this.cypherAlgorithm.textEncryption(privateKey),
//       is_derived: true,
//       path: path,
//     };

//     accountsData.accounts.push(newAddressData);

//     this.localStore.setItem('user_accounts', accountsData);
//   }

//   getAccountSigningKey(accountIndex: number = 0) {
//     let accountsData = this.localStore.getItem<TNBChatAccount>('user_accounts')!;

//     if (accountsData) {
//       const {accounts} = accountsData;
//       const account = accounts[accountIndex];

//       return this.cypherAlgorithm.textDecryption(account.encrypted_signing_key);
//     }
//   }
// }
