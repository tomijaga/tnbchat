import {Account} from 'thenewboston/src';
import {HdWallet} from 'tnb-hd-wallet';
import {TNBChatAccount, UserAddress} from 'types';
import {Aes} from 'utils';
import {LocalStorage} from './localStorage';

export class AccountManager {
  public localStore: LocalStorage;
  private cypherAlgorithm: Aes;

  constructor(login: Partial<{password: string; hash: string}>) {
    this.localStore = new LocalStorage();
    this.cypherAlgorithm = new Aes(login);
  }

  addSeedPhrase(seedPhrase: string, username?: string) {
    if (seedPhrase && seedPhrase.split(' ').length === 12) {
      let accountsData = this.localStore.getItem<TNBChatAccount>('tnbchat_account');

      const seed_phrase_hash = this.cypherAlgorithm.ctrEncryption(seedPhrase);

      if (accountsData !== null) {
        accountsData.seed_phrase_hash = seed_phrase_hash;
      } else {
        accountsData = {
          seed_phrase_hash: seed_phrase_hash,
          num_of_imported_addresses: 0,
          addresses: [],
        };
      }

      this.localStore.setItem('tnbchat_account', accountsData);

      if (username) {
        this.generateAddress(username);
      }
    }
  }

  importAddress(signingKey: string, username: string) {
    if (signingKey.length === 64) {
      let accountsData = this.localStore.getItem<TNBChatAccount>('tnbchat_account')!;

      const newAddressData: UserAddress = {
        account_number: new Account(signingKey).accountNumberHex,
        username,
        signing_key_hash: this.cypherAlgorithm.ctrEncryption(signingKey),
        is_derived: false,
      };

      accountsData.num_of_imported_addresses += 1;
      accountsData.addresses.push(newAddressData);

      this.localStore.setItem('tnbchat_account', accountsData);
    }
  }

  // High security clearance. Need the user to enter
  // password again becuase all data will be deleted
  deleteAllAccountData(password: string) {
    if (password) {
      const aes = new Aes({password});

      if (aes.ctrDecryption(this.localStore.getItem('encrypted_text')!) === process.env.REACT_APP_PLAIN_TEXT) {
        localStorage.clear();
      }
    }
  }

  generateAddress(username: string) {
    let accountsData = this.localStore.getItem<TNBChatAccount>('tnbchat_account')!;

    const decrypted_seed_phrase = this.cypherAlgorithm.ctrDecryption(accountsData.seed_phrase_hash);

    const {path, publicKey, privateKey} = HdWallet.thenewboston(decrypted_seed_phrase).getAddress(0, 0);

    const newAddressData: UserAddress = {
      account_number: publicKey,
      username,
      signing_key_hash: this.cypherAlgorithm.ctrEncryption(privateKey),
      is_derived: true,
      path: path,
    };

    accountsData.addresses.push(newAddressData);

    this.localStore.setItem('tnbchat_account', accountsData);
  }

  getAccountSigningKey(accountIndex: number = 0) {
    let accountsData = this.localStore.getItem<TNBChatAccount>('tnbchat_account')!;

    if (accountsData) {
      const {addresses} = accountsData;
      const account = addresses[accountIndex];

      return this.cypherAlgorithm.ctrDecryption(account.signing_key_hash);
    }
  }
}
