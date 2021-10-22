export interface Account {
  account_number: string;
  encrypted_signing_key: string;
}

export interface SeedPhraseAccount extends Account {
  is_derived: true;
  path: string;
}

export interface ImportedAccount extends Account {
  is_derived: false;
}

export interface UserData {
  username: string;

  //profile picture
  pfp: string;
  mainnet_balance: number;
  testnet_balance: number;
}

export type UserAccount = (SeedPhraseAccount & Partial<UserData>) | (ImportedAccount & Partial<UserData>);

export interface TNBChatAccount {
  seed_phrase_hash: string;
  selected_index?: number;

  // We need this because both the derived and imported accounts are kept in the same array
  // When deriving new accounts we will be able to calculate how many have already been derived
  num_of_imported_accounts: number;
  accounts: UserAccount[];
}
