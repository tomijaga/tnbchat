export interface SeedPhraseAddress extends Address {
  is_derived: true;
  path: string;
}

export interface ImportedAddress extends Address {
  is_derived: false;
}

export interface Address {
  account_number: string;
  signing_key_hash: string;
}

export interface UserData {
  username: string;
}

export type UserAddress = (SeedPhraseAddress & Partial<UserData>) | (ImportedAddress & Partial<UserData>);

export interface TNBChatAccount {
  seed_phrase_hash: string;

  // We need this because both the derived and imported addresses are kept in the same array
  // When deriving new accounts we will be able to calculate how many have already been derived
  num_of_imported_addresses: number;
  addresses: UserAddress[];
}
