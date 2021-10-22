import {Account, AccountPaymentHandler, PaginatedTransactionEntry, PaymentHandler} from 'packages/thenewboston/src';
import {MAINNET_BANK_URL, TESTNET_BANK_URL} from 'constant';
import {nanoid} from 'nanoid';

type Network = 'mainnet' | 'testnet';
export class TNBChatAccountManager extends AccountPaymentHandler {
  public network: Network;

  constructor(signingKey: string, network: Network = 'testnet') {
    super({
      account: new Account(signingKey),
      bankUrl: network === 'testnet' ? TESTNET_BANK_URL : MAINNET_BANK_URL,
    });

    this.network = network;
    super.init();
  }

  /**
   * params memo - The content of the Post (Text, link, images)
   * params channel - The account number for the channel to send post tool
   */

  async makePost(memo: string, channel: string): Promise<PaginatedTransactionEntry> {
    const block = await this.sendCoins(channel, 1, memo);

    return {
      recipient: channel,
      amount: 1,
      block,
      memo,
      id: nanoid(),
    };
  }

  async switchNetwork(network: Network) {
    if (this.network === network) return;

    this.network = network;
    const bankUrl = network === 'testnet' ? TESTNET_BANK_URL : MAINNET_BANK_URL;

    this.client = new PaymentHandler({bankUrl});
    await this.init();
  }
}
