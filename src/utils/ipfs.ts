import fleekStorage from '@fleekhq/fleek-storage-js';

interface IpfsStorageInput {
  filename: string;
  data: any;
  dataType: 'message' | 'post' | 'profile' | 'image' | 'gif' | 'video';
}

export const storeOnIpfs = async ({filename, data, dataType}: IpfsStorageInput) => {
  let payload;

  if (dataType === 'message' || dataType === 'post' || 'profile') {
    payload = JSON.stringify(data);
  } else {
    payload = data;
  }

  const {REACT_APP_FLEEK_STORAGE_API_KEY: fleekApiKey, REACT_APP_FLEEK_STORAGE_API_SECRET: fleekApiSecret} =
    process.env;

  if (fleekApiKey && fleekApiSecret) {
    if (data) {
      const uploadedFile = await fleekStorage.upload({
        apiKey: fleekApiKey,
        apiSecret: fleekApiSecret,
        key: `tnbchat/${dataType}s/${filename}`,
        data: payload,
      });

      return uploadedFile;
    }
    throw Error('Data is missing');
  }
  throw Error('Api Keys are missing');
};
