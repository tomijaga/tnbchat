import {Account, AccountPaymentHandler, PaginatedTransactionEntry, PaymentHandler} from 'packages/thenewboston/src';
import {MAINNET_BANK_URL, TESTNET_BANK_URL} from 'constant';
import {nanoid} from 'nanoid';
import {storeOnIpfs} from 'utils/ipfs';
import {MessageData} from 'api/message';
import {IpfsProfileData, ProfileData} from 'types';

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

  private memo(ipfs_hash: string, data_type?: string) {
    const dataTypeCode = {
      MESSAGE: 'DM',
      POST: 'PS',
      PROFILE: 'PR',
    };
    return `tnbchat ipfs_hash ${ipfs_hash}`;
  }

  /**
   * @params memo - The content of the Post (Text, link, images)
   * @params channel - The account number for the channel to send post tool
   */

  async makePost(channel: string, content: string, media?: string[]): Promise<PaginatedTransactionEntry & any> {
    const data: {
      text: string;
      nsfw: boolean;
      data_type: 'POST';
      media: string[];
      version: 'v1.0';
    } = {
      text: content,
      nsfw: false,
      media: media ?? [],
      data_type: 'POST',
      version: 'v1.0',
    };

    const {hashV0} = await storeOnIpfs({dataType: 'post', filename: nanoid(), data});
    const memo = this.memo(hashV0);
    const block = await this.sendCoins(channel, 1, memo);

    return {
      recipient: channel,
      amount: 1,
      block,
      memo,
      ipfs_data: data,
      id: nanoid(),
    };
  }

  async createProfile(
    userAccountNumber: string,
    content: Omit<IpfsProfileData, 'data_type' | 'version'>,
  ): Promise<Partial<ProfileData>> {
    const data: IpfsProfileData = {
      ...content,
      data_type: 'PROFILE',
      version: 'v1.0',
    };

    const {hashV0} = await storeOnIpfs({dataType: 'profile', filename: userAccountNumber, data});
    const memo = this.memo(hashV0);
    const block = await this.sendCoins(userAccountNumber, 1, memo);

    return {
      recipient: userAccountNumber,
      amount: 1,
      block,
      memo,
      ipfs_data: data,
      id: nanoid(),
    };
  }

  async sendDirectMessage(recipient: string, message: string) {
    if (recipient && recipient.length === 64) {
      const {encryptedMessage, nonce} = this.account.peerEncryption(recipient, message);

      const {encryptedMessage: messageEncryptedBySendersKey} = this.account.encryptMessage(message, nonce);

      const data: MessageData['ipfs_data'] = {
        encrypted_message: encryptedMessage,
        nonce,
        copy_for_sender: messageEncryptedBySendersKey,
        data_type: 'MESSAGE',
        version: 'v1.0',
      };

      const {hashV0} = await storeOnIpfs({dataType: 'message', filename: nanoid(), data});

      const block = await this.sendCoins(recipient, 1, this.memo(hashV0));

      return {...block, ipfs_data: data};
    }
  }

  decryptDirectMessage(messageTx: MessageData) {
    const {
      ipfs_data,
      block: {sender},
    } = messageTx;

    const sentByMe = sender === this.account.accountNumberHex;

    let decryptedMessage = '';
    if (!ipfs_data) return {decryptedMessage, sentByMe};

    const {copy_for_sender, nonce, encrypted_message} = ipfs_data;

    if (sentByMe) {
      decryptedMessage = this.account.decryptMessage(copy_for_sender, nonce);
    } else {
      decryptedMessage = this.account.peerDecryption(sender, encrypted_message, nonce);
    }

    return {decryptedMessage, sentByMe};
  }

  // async switchNetwork(network: Network) {
  //   if (this.network === network) return;

  //   this.network = network;
  //   const bankUrl = network === 'testnet' ? TESTNET_BANK_URL : MAINNET_BANK_URL;

  //   this.client = new PaymentHandler({bankUrl});
  //   await this.init();
  // }
}
