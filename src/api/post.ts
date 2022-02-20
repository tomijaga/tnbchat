import {MAINNET_GENERAL_CHANNEL, TESTNET_GENERAL_CHANNEL} from 'constant';
import {PaginatedTransactionEntry} from 'packages/thenewboston/src';
import {testnetBank} from './node';
import {Network} from 'types';
import {ChainData, getChainData} from './chain';

interface GetPostOptions {
  channel?: string;
  account_number?: string;
  network?: Network;
  balance_key?: string;
}

interface IpfsPostData {
  text: string;
  nsfw: boolean;
  data_type: 'POST';
  media: {media_type: 'video' | 'image' | 'audio' | 'gif'; link_type: 'ipfs_hash' | 'url'; link: string}[];
  version: 'v1.0';
}

export type PostData = ChainData<IpfsPostData>;

const defaultPostOptions = {network: Network.testnet};

export const getPosts = async ({
  channel,
  network,
  account_number,
  balance_key,
}: GetPostOptions = defaultPostOptions) => {
  const defaultChannel = network === 'testnet' || !network ? TESTNET_GENERAL_CHANNEL : MAINNET_GENERAL_CHANNEL;

  const txOptions = {
    limit: 100,
    balance_key,
    sender: account_number,
    fee: 'NONE' as const,
    recipient: channel && channel.length === 64 ? channel : defaultChannel,
  };

  const {results} = await getChainData<IpfsPostData>(txOptions);
  return results.reverse();
};

interface GetSinglePostOptions extends Omit<GetPostOptions, 'channel' | 'account_number'> {
  balance_key: string;
}

export const getPost = async ({network, balance_key}: GetSinglePostOptions) => {
  network = !network && network === Network.testnet ? Network.testnet : Network.mainnet;
  return (await getPosts({balance_key, network}))[0];
};
