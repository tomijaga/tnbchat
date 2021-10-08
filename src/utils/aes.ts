import aesjs from "aes-js";
import bcrypt from "bcrypt";

export const stringToBytes = (text: string) => {
  return aesjs.utils.hex.toBytes(text);
};

export const bytesToString = (bytes: Uint8Array) => {
  return aesjs.utils.utf8.fromBytes(bytes);
};

export class Aes {
  private hashInBytes: Uint8Array;
  constructor(keyAsString: string) {
    // 128-bit key (16 bytes * 8 bits/byte = 128 bits)
    const salt = bcrypt.genSaltSync(Number(process.env.REACT_APP_SALT_ROUNDS!));
    const hash = bcrypt.hashSync(keyAsString, salt);
    console.log({ hash });
    this.hashInBytes = stringToBytes(hash);
  }

  ctrEncryption = (text: string, counter: number = 1) => {
    // Convert text to bytes
    const textBytes = stringToBytes(text);

    // The counter is optional, and if omitted will begin at 1
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      this.hashInBytes,
      new aesjs.Counter(counter)
    );
    const encryptedBytes = aesCtr.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    const encryptedHex = bytesToString(encryptedBytes);

    return encryptedHex;
  };

  ctrDecryption = (encryptedHex: string, counter: number = 1) => {
    // When ready to decrypt the hex string, convert it back to bytes
    const encryptedBytes = stringToBytes(encryptedHex);

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      this.hashInBytes,
      new aesjs.Counter(counter)
    );
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);

    // Convert our bytes back into text
    const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

    return decryptedText;
  };
}
