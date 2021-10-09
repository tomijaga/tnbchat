import aesjs from "aes-js";
import scrypt from "scrypt-js";

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

export class Aes {
  private hashInBytes: Uint8Array;

  constructor(password: string) {
    // We need each key to be 16 bytes so we are going to create a
    // 16 byte hash with the user's password and a known salt

    const keyInBytes = Buffer.from(password.normalize("NFKC"));
    const saltInBytes = Buffer.from(
      process.env.REACT_APP_SALT!.normalize("NFKC")
    );

    const bytesLength = 16;
    this.hashInBytes = scrypt.syncScrypt(
      keyInBytes,
      saltInBytes,
      1024,
      8,
      1,
      bytesLength
    );
    console.log({ password, hashInBytes: this.hashInBytes });
  }

  ctrEncryption = (text: string, counter: number = 1) => {
    text = text.normalize();
    console.log({ text });

    // Convert text to bytes
    const textBytes = stringToBytes(text);

    // The counter is optional, and if omitted will begin at 1
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      this.hashInBytes,
      new aesjs.Counter(counter)
    );
    const encryptedBytes = aesCtr.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    const encryptedHex = bytesToHex(encryptedBytes);

    // console.log({ text, encryptedHex });
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
