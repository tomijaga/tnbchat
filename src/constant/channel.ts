import {channels} from './addresses';
export const MAINNET_GENERAL_CHANNEL = process.env.NODE_ENV === 'production' ? channels.general : channels.dev;

export const TESTNET_GENERAL_CHANNEL = channels.testnet;
