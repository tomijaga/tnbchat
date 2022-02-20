export {Aes, bytesToString, stringToBytes} from './aes';
export {decodePostMessage, encodePostMessage} from './base58';
export * from './store';
export * from './app';

export const getDefaultPfp = (accountNumber: string) => {
  return `https://robohash.org/${accountNumber}.png?set=set5`;
};

export const hexPattern = /^#?([a-f0-9]{1,})$/i;

export const shortenAddress = (accountNumber: string) => {
  return `${accountNumber.slice(0, 4)}..${accountNumber.slice(-4)}`;
};
