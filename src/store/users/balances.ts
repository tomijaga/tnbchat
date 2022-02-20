import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {USER_ACCOUNTS, USER_ACCOUNT_BALANCES} from 'constant';
import {UserAccount, Dict, IpfsProfileData, AccountNumber, AccountBalance} from 'types';
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

const accountBalances = createSlice({
  initialState: {} as Dict<AccountBalance>,
  name: USER_ACCOUNT_BALANCES,
  reducers: {
    setAccountBalance: setAccountNumberReducer<AccountBalance>(),
    unsetAccountBalance: unsetAccountNumberReducer(),
  },
});

export const {setAccountBalance, unsetAccountBalance} = accountBalances.actions;
export default accountBalances.reducer;
