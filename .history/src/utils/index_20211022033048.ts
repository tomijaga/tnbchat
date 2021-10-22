export {Aes, bytesToString, stringToBytes} from './aes';
export {decode, encodePostMessage} from './base58';
export * from './store';
export * from './app';

export const getPfp = (accountNumber: string) => {
  return `https://robohash.org/${accountNumber}.png?sets=set1,set3,set5`;
};

export const hexPattern = /^#?([a-f0-9]{1,})$/i;

export const reduceAccNumber = (accountNumber: string) => {
  return `${accountNumber.slice(0, 4)}..${accountNumber.slice(-4)}`;
};
