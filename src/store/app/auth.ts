import {combineReducers, createSlice} from '@reduxjs/toolkit';
import {AUTH} from 'constant';
import {AuthData, AuthStateData, LocalAuthData, SessionAuthData} from 'types/store';
import {
  clearLocalAndStateReducer,
  setLocalAndPartialStateReducer,
  setSessionAndPartialStateReducer,
  setPartialStateReducer,
  clearSessionAndStateReducer,
} from 'utils';
import {localStore, sessionStore} from 'utils/storage';

const localAuthData = localStore.getItem<LocalAuthData>('auth');
const sessionAuthData = sessionStore.getItem<SessionAuthData>('auth');

const localAuth = createSlice({
  initialState: {
    encryptedSafetyText: '',
    encryptedSeedPhrase: '',
    derivedAccountsNum: 0,
    selectedAccount: '',
    ...localAuthData,
  } as LocalAuthData,
  name: 'AUTH_LOCAL_DATA',
  reducers: {
    setLocalAuthData: setLocalAndPartialStateReducer<LocalAuthData>(AUTH),
    clearLocalAuthData: clearLocalAndStateReducer(AUTH),
  },
});

const sessionAuth = createSlice({
  initialState: {
    appEncryptedUserPasswordHash: '',
    ...sessionAuthData,
  } as SessionAuthData,
  name: 'AUTH_SESSION_DATA',
  reducers: {
    setSessionAuthData: setSessionAndPartialStateReducer<SessionAuthData>(AUTH),
    clearSessionAuthData: clearSessionAndStateReducer(AUTH),
  },
});

const stateAuth = createSlice({
  initialState: {
    isLoggedIn: sessionAuthData ? !!sessionAuthData?.appEncryptedUserPasswordHash : false,
    hasCreatedSeedPhrase: localAuthData ? !!localAuthData.encryptedSeedPhrase : false,
    showAuthModal: false,
    showManageAccountsModal: false,
    authStatus: 'NONE',
  } as AuthData,
  name: AUTH,
  reducers: {
    setStateAuthData: setPartialStateReducer<AuthStateData>(),
  },
});

export const {setLocalAuthData, clearLocalAuthData} = localAuth.actions;
export const {setStateAuthData} = stateAuth.actions;
export const {setSessionAuthData, clearSessionAuthData} = sessionAuth.actions;

export default combineReducers({
  local: localAuth.reducer,
  session: sessionAuth.reducer,
  state: stateAuth.reducer,
});
