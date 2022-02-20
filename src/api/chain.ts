import {PaginatedEntry, PaginatedResponse, PaginatedTransactionEntry} from 'packages/thenewboston/src';
import {testnetBank} from './node';
import {Network} from 'types';
import {CID} from 'multiformats/cid';
import axios from 'axios';

interface GetPostOptions {
  recipient?: string;
  account_number?: string;
  balance_key?: string;
  sender?: string;
  limit?: number;
  offset?: number;
  fee?: 'NONE' | 'BANK' | 'PRIMARY_VALIDATOR';
}

export type ChainData<IpfsDataType = Object> = PaginatedTransactionEntry & PaginatedEntry & {ipfs_data?: IpfsDataType};

export const getChainData = async <IpfsDataType = Object>({
  recipient,
  account_number,
  balance_key,
  sender,
  limit = 50,
  offset = 0,
  fee = 'NONE',
}: GetPostOptions) => {
  const txOptions = {
    limit,
    offset,
    balance_key,
    account_number,
    block__sender: sender,
    fee,
    recipient,
  };

  console.log(txOptions);

  const response = (await testnetBank.getTransactions(txOptions)) as PaginatedResponse<ChainData<IpfsDataType>>;
  for (const tx of response.results) {
    console.log({tx});
    const split_memo = tx.memo?.split(' ');

    if (split_memo && (split_memo[0] === 'ipfs_hash' || split_memo[1] === 'ipfs_hash')) {
      try {
        const ipfs_hash_v0 = CID.parse(split_memo[split_memo.length - 1]);
        // hash version 0 chosen to save space.
        // Not all nodes support this version

        console.log(ipfs_hash_v0);
        // So we have to convert to base 32 which is supported by all nodes
        const ipfs_hash_v1 = ipfs_hash_v0.toV1().toString();
        console.log(ipfs_hash_v1);
        const {data: ipfs_data} = await axios.get(`https://${ipfs_hash_v1}.ipfs.dweb.link`);
        tx.ipfs_data = ipfs_data;
      } catch (e) {
        console.log(e);
      }
    }
  }

  return response;
};
