import axios from 'axios';
import bs58 from 'bs58';
import isUrl from 'is-url';
// import tinyurl from 'tinyurl';

export const encodePostMessage = async (postText: string) => {
  const words = postText.split(' ');
  console.log({postText});
  if (isUrl(postText)) {
    console.log('is-url');
    if (postText.length > 28) {
      postText = (await axios.get(`http://tinyurl.com/api-create.php?url=${postText}`)).data;
      console.log('shortened url', postText);
    }
  }

  const textAsBytes = Buffer.from(encodeURIComponent(postText).replaceAll('%20', ' '));

  const base_58_text = bs58.encode(textAsBytes);
  return base_58_text;
};

export const decodePostMessage = (codedText: string) => {
  const bytes = bs58.decode(codedText);
  const codedURI = bytes.reduce((cumulatedText: string, byte: any) => {
    return (cumulatedText += String.fromCharCode(byte));
  }, '');
  return decodeURIComponent(codedURI);
};
