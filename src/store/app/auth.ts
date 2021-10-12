import {createSlice} from '@reduxjs/toolkit';
import {AuthDataStore} from 'types';
import {setObjectsReducer} from 'utils';

const auth = createSlice({
  initialState: {
    isLoggedIn: false,
    showAuthModal: false,
    authStatus: 'NONE',
    passwordHash: null,
  } as AuthDataStore,
  name: 'AUTH',
  reducers: {
    setAuthData: setObjectsReducer<AuthDataStore>(),
  },
});

export const {setAuthData} = auth.actions;
export default auth.reducer;
