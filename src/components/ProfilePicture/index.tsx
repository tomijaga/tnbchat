import React, {CSSProperties, FC} from 'react';
import Avatar from 'antd/es/avatar';
import {useSelector} from 'react-redux';
import {getUserProfiles} from 'selectors';
import {AccountNumber} from 'types';
import {getDefaultPfp} from 'utils';
import {AvatarProps} from 'antd';

export const ProfilePicture: FC<{accountNumber: string} & AvatarProps> = ({accountNumber, style, ...avatarProps}) => {
  const profiles = useSelector(getUserProfiles);
  const profile = profiles[accountNumber];

  return (
    <Avatar
      {...avatarProps}
      style={{background: 'rgba(0,0,0, 0.05)', ...style}}
      src={profile?.pfp_url || getDefaultPfp(accountNumber)}
      alt="pfp"
    />
  );
};

export default ProfilePicture;
