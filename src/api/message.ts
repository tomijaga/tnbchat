import {RetrievedPaginationData} from 'types';
import {ChainData, getChainData} from './chain';

interface IpfsMessageData {
  encrypted_message: string;
  copy_for_sender: string;
  nonce: string;
  data_type: 'MESSAGE';
  version: string;
}

export type MessageData = ChainData<IpfsMessageData>;

export const getMessages = async (
  account_number: string,
  friend_account_number: string,
  prev_retrieved_data: RetrievedPaginationData,
  messagesToRetrieve: 'old' | 'new',
) => {
  const limit = 100;
  let sent_limit, sent_offset, received_limit, received_offset;

  if (messagesToRetrieve === 'new') {
    sent_limit = 100;
    sent_offset = 0;

    received_limit = 100;
    received_offset = 0;
  } else {
    sent_limit = 100;
    sent_offset = prev_retrieved_data.sent.end - prev_retrieved_data.sent.start;

    received_limit = 100;
    const prev_start = prev_retrieved_data.received.end - prev_retrieved_data.received.start;
    received_offset = prev_start + received_limit >= 0 ? prev_start - received_limit : prev_start;
  }

  const sent = await getChainData<IpfsMessageData>({account_number, recipient: friend_account_number, limit});

  const received = await getChainData<IpfsMessageData>({
    account_number: friend_account_number,
    recipient: account_number,
  });
  sent.results.push(...received.results);

  const messages = sent.results;
  messages.sort((a, b) => new Date(a.block.created_date).getTime() - new Date(b.block.created_date).getTime());
  return {
    messages,
    retrieved_data: {
      sent: {start: sent.count - limit, end: sent.count},
      received: {start: received.count - limit, end: received.count},
    },
  };
};
