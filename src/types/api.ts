import {ChainData} from 'api/chain';

export interface IpfsProfileData {
  pfp_url: string;
  banner_url: string;
  display_name: string;
  bio: string;
  location: string;
  country_code: string;
  website_url: string;
  data_type: 'PROFILE';
  version: 'v1.0';
}

export type ProfileData = ChainData<IpfsProfileData>;
