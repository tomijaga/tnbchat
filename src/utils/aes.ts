import aesjs from 'aes-js';
import scrypt from 'scrypt-js';

export const stringToBytes = (text: string) => {
  return aesjs.utils.utf8.toBytes(text);
};

export const hexToBytes = (hex: string) => {
  return aesjs.utils.hex.toBytes(hex);
};

export const bytesToHex = (bytes: Uint8Array) => {
  return aesjs.utils.hex.fromBytes(bytes);
};

export const bytesToString = (bytes: Uint8Array) => {
  return aesjs.utils.utf8.fromBytes(bytes);
};

interface AesParams {
  password: string;
  hash: string;
}

export class Aes {
  readonly hashInBytes: Uint8Array;

  constructor({password, hash}: Partial<AesParams>) {
    // We need each key to be 16 bytes so we are going to create a
    // 16 byte hash with the user's password and a known salt

    if (password) {
      this.hashInBytes = Aes.hashPassword(password);
    } else if (hash) {
      const aesWithTnbChatKey = new Aes({password: process.env.REACT_APP_ENCRYPTION_KEY});
      this.hashInBytes = aesWithTnbChatKey.ctrDecryption(hash);
      console.log({backToHash: this.hashInBytes});
    } else {
      throw new Error('');
    }
  }

  static verifyPassword(password: string, hash: string) {
    return bytesToHex(Aes.hashPassword(password)) === hash;
  }

  static hashPassword(password: string) {
    if (!password || password.length < 7) throw Error('Invalid Password');

    const keyInBytes = Buffer.from(password.normalize('NFKC'));
    const saltInBytes = Buffer.from(process.env.REACT_APP_16_BYTES_SALT!.normalize('NFKC'));
    const bytesLength = 16;
    return scrypt.syncScrypt(keyInBytes, saltInBytes, 1024, 8, 1, bytesLength);
  }

  ctrEncryption = (textBytes: Uint8Array, counter: number = 1) => {
    // The counter is optional, and if omitted will begin at 1
    const aesCtr = new aesjs.ModeOfOperation.ctr(this.hashInBytes, new aesjs.Counter(counter));
    const encryptedBytes = aesCtr.encrypt(textBytes);
    console.log({encryptedBytes});
    return encryptedBytes;
  };

  textEncryption = (text: string, counter: number = 1) => {
    text = text.normalize('NFKC');
    const textBytes = stringToBytes(text);

    const encryptedBytes = this.ctrEncryption(textBytes, counter);

    // To print or store the binary data, you may convert it to hex
    return bytesToHex(encryptedBytes);
  };

  ctrDecryption = (encryptedHex: string | Uint8Array, counter: number = 1) => {
    let encryptedBytes: Uint8Array;
    // When ready to decrypt the hex string, convert it back to bytes
    if (typeof encryptedHex === 'string') encryptedBytes = hexToBytes(encryptedHex);
    else encryptedBytes = encryptedHex;

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    const aesCtr = new aesjs.ModeOfOperation.ctr(this.hashInBytes, new aesjs.Counter(counter));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);

    return decryptedBytes;
  };

  textDecryption = (encryptedHex: string, counter: number = 1) => {
    const decryptedBytes = this.ctrDecryption(encryptedHex, counter);

    // Convert our bytes back into text
    return bytesToString(decryptedBytes);
  };

  get encryptedPasswordHash() {
    const aesWithTnbChatKey = new Aes({password: process.env.REACT_APP_ENCRYPTION_KEY});
    console.log({hashInBytes: this.hashInBytes});
    const encryptedHashInBytes = aesWithTnbChatKey.ctrEncryption(this.hashInBytes);
    return bytesToHex(encryptedHashInBytes);
  }
}
