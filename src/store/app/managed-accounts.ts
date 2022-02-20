import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {USER_ACCOUNTS} from 'constant';
import {UserAccount, Dict} from 'types';
import {localStore} from 'utils/storage';
import {setLocalAndPartialStateReducer, clearLocalAndStateReducer, unsetLocalAndStateReducer} from 'utils/store';

const userAccounts = localStore.getItem('user_accounts') as Dict<UserAccount>;

const initState = {};

const auth = createSlice({
  initialState: userAccounts || (initState as Dict<UserAccount>),
  name: USER_ACCOUNTS,
  reducers: {
    setUserAccounts: (state: any, action: PayloadAction<UserAccount>) => {
      const payload = {
        [action.payload.account_number]: action.payload,
      } as any;

      const newAction: PayloadAction<Dict<UserAccount>> = {
        payload,
        type: action.type,
      };

      setLocalAndPartialStateReducer<Dict<UserAccount>>('user_accounts')(state, newAction);
    },

    unsetUserAccount: (state: any, action: PayloadAction<string>) => {
      const newAction: PayloadAction<string[]> = {
        type: action.type,
        payload: [action.payload],
      };
      unsetLocalAndStateReducer('user_accounts')(state, newAction);
    },
    clearUserAccounts: clearLocalAndStateReducer('user_accounts'),
  },
});

export const {setUserAccounts, unsetUserAccount, clearUserAccounts} = auth.actions;
export default auth.reducer;
