import axios from 'axios';
import bs58 from 'bs58';
import isUrl from 'is-url';
// import tinyurl from 'tinyurl';

export const encode = async (postText: string) => {
  if (isUrl(postText)) {
    if (postText.endsWith('.png')) {
      // if (await isImageUrl(postText)) {
      //Link to create tinyurl
      postText = (await axios.get(`http://tinyurl.com/api-create.php?url=${postText}`)).data;
      console.log('shortened image link', postText);
    }
  }

  const textAsBytes = Buffer.from(encodeURIComponent(postText).replaceAll('%20', ' '));

  const base_58_text = bs58.encode(textAsBytes);
  return base_58_text;
};

export const decode = (codedText: string) => {
  const bytes = bs58.decode(codedText);
  const codedURI = bytes.reduce((cumulatedText: string, byte: any) => {
    return (cumulatedText += String.fromCharCode(byte));
  }, '');
  return decodeURIComponent(codedURI);
};
