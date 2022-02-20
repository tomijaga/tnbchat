import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {USER_ACCOUNTS, USER_PROFILES} from 'constant';
import {UserAccount, Dict, IpfsProfileData, AccountNumber} from 'types';
import {localStore} from 'utils/storage';
import {
  setLocalAndPartialStateReducer,
  clearLocalAndStateReducer,
  unsetLocalAndStateReducer,
  setPartialStateReducer,
  setAccountNumberReducer,
  unsetAccountNumberReducer,
  partialObjectUpdate,
} from 'utils/store';

const profiles = createSlice({
  initialState: {} as Dict<IpfsProfileData & AccountNumber>,
  name: USER_PROFILES,
  reducers: {
    setUserProfile: setAccountNumberReducer<IpfsProfileData & AccountNumber>(),

    unsetUserProfile: unsetAccountNumberReducer(),
  },
});

export const {setUserProfile, unsetUserProfile} = profiles.actions;
export default profiles.reducer;
