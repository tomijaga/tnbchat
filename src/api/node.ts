import {MAINNET_BANK_URL, TESTNET_BANK_URL} from 'constant/url';
import {Bank} from 'packages/thenewboston/src';

export const mainnetBank = new Bank(MAINNET_BANK_URL);

export const testnetBank = new Bank(TESTNET_BANK_URL);

export const currentNetworkBank = testnetBank;
