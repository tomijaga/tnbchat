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
      this.hashInBytes = Aes.hashFromPassword(password);
    } else if (hash) {
      this.hashInBytes = hexToBytes(hash);
    } else {
      throw new Error('');
    }
  }

  static verify(password: string, hash: string) {
    return bytesToHex(Aes.hashFromPassword(password)) === hash;
  }

  static hashFromPassword(password: string) {
    if (!password || password.length < 7) throw Error('Invalid Password');

    const keyInBytes = Buffer.from(password.normalize('NFKC'));
    const saltInBytes = Buffer.from(process.env.REACT_APP_SALT!.normalize('NFKC'));
    const bytesLength = 16;
    return scrypt.syncScrypt(keyInBytes, saltInBytes, 1024, 8, 1, bytesLength);
  }

  ctrEncryption = (text: string, counter: number = 1) => {
    text = text.normalize();
    console.log({text});

    // Convert text to bytes
    const textBytes = stringToBytes(text);

    // The counter is optional, and if omitted will begin at 1
    const aesCtr = new aesjs.ModeOfOperation.ctr(this.hashInBytes, new aesjs.Counter(counter));
    const encryptedBytes = aesCtr.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    const encryptedHex = bytesToHex(encryptedBytes);

    // console.log({ text, encryptedHex });
    return encryptedHex;
  };

  ctrDecryption = (encryptedHex: string, counter: number = 1) => {
    // When ready to decrypt the hex string, convert it back to bytes
    const encryptedBytes = hexToBytes(encryptedHex);
    console.log({encryptedHex, encryptedBytes, x: Buffer.from(encryptedHex, 'hex')});
    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    const aesCtr = new aesjs.ModeOfOperation.ctr(this.hashInBytes, new aesjs.Counter(counter));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    console.log({decryptedBytes});

    // Convert our bytes back into text
    const decryptedText = bytesToString(decryptedBytes);

    return decryptedText;
  };

  get hashInHex() {
    return bytesToHex(this.hashInBytes);
  }
}
