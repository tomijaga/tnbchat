export * from './localStorage';
export * from './store';
export * from './user';

export enum Network {
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export interface Dict<T> {
  [x: string]: T;
}
