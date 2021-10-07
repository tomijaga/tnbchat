import axios from "axios"
import bs58 from "bs58";
import { default as isImageUrl } from "image-url-validator";
import isUrl from "is-url";

export const encode = async (plainText: string) => {
  if (isUrl(plainText)) {
    if (plainText.endsWith(".png")){
    // if (await isImageUrl(plainText)) {
    //Link to create tinyurl
    plainText = (
      await axios.get(`http://tinyurl.com/api-create.php?url=${plainText}`)
    ).data;
    console.log("shortened image link", plainText);
    }
  }

  const textAsBytes = Buffer.from(
    encodeURIComponent(plainText).replaceAll("%20", " ")
  );

  const base_58_text = bs58.encode(textAsBytes);
  console.log("Text length", base_58_text.length);
  return base_58_text;
};

export  const decode = (codedText: string) => {
    const bytes = bs58.decode(codedText);
    const codedURI = bytes.reduce((cumulatedText: string, byte: any) => {
      return (cumulatedText += String.fromCharCode(byte));
    }, "");
    return decodeURIComponent(codedURI);
  };