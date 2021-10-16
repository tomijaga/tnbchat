import {MAINNET_GENERAL_CHANNEL, TESTNET_GENERAL_CHANNEL} from 'constant';
import {PaginatedTransactionEntry} from 'thenewboston/src';
import {testnetBank} from './node';
import {Network} from 'types';

interface GetPostOptions {
  channel?: string;
  account_number?: string;
  network?: Network;
  balance_key?: string;
}

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
    block__sender: account_number,
    fee: 'NONE' as const,
    recipient: channel && channel.length === 64 ? channel : defaultChannel,
  };

  const txs = await testnetBank.getTransactions(txOptions);

  const pendingPosts: {[x: string]: PaginatedTransactionEntry} = {};
  const completedPosts = txs.results
    .reverse()
    .reduce((completePosts: PaginatedTransactionEntry[], tx: PaginatedTransactionEntry) => {
      if (!tx.memo) tx.memo = '';
      const sender = tx.block.sender;

      const pendingPost = pendingPosts[sender];
      if (pendingPost) {
        pendingPost.memo += tx.memo;
        if (tx.memo.length < 64) {
          delete pendingPosts[sender];
        }
      } else {
        completePosts.push(tx);
      }
      if (tx.memo.length === 64) {
        pendingPosts[sender] = tx;
      }

      return completePosts;
    }, [])
    .reverse();

  return completedPosts;
};

interface GetSinglePostOptions extends Omit<GetPostOptions, 'channel' | 'account_number'> {
  balance_key: string;
}

export const getPost = async ({network, balance_key}: GetSinglePostOptions) => {
  network = !network && network === Network.testnet ? Network.testnet : Network.mainnet;
  return (await getPosts({balance_key, network}))[0];
};
