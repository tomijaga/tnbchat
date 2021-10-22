import {combineReducers} from '@reduxjs/toolkit';

// import reducer, {actions}
import authDataReducer, {
  setLocalAuthData,
  setSessionAuthData,
  clearLocalAuthData,
  setStateAuthData,
  clearSessionAuthData,
} from './auth';
import UserAccountLedgerReducer, {setUserAccounts, unsetUserAccount, clearUserAccounts} from './accounts';

export {
  setLocalAuthData,
  setSessionAuthData,
  unsetUserAccount,
  clearLocalAuthData,
  setStateAuthData,
  clearSessionAuthData,
};
export {setUserAccounts, clearUserAccounts};

export default combineReducers({
  auth: authDataReducer,
  accounts: UserAccountLedgerReducer,
});
