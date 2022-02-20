import {IpfsProfileData} from 'types';
import {admin} from 'constant/addresses';
import {getChainData} from './chain';

export const getUserProfile = async (userAccountNumber: string) => {
  const {results: profiles} = await getChainData<IpfsProfileData>({
    recipient: userAccountNumber,
    sender: admin.user_profiles,
    limit: 1,
  });

  if (profiles.length) {
    return profiles[0];
  }

  return null;
};
