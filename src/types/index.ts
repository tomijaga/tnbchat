export * from './localStorage';
export * from './store';
export * from './user';
export * from './api';

export enum Network {
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export interface Dict<T> {
  [x: string]: T;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
