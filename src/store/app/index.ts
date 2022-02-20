import {combineReducers} from '@reduxjs/toolkit';

// import reducer, {actions}
import authDataReducer from './auth';
import UserAccountLedgerReducer from './managed-accounts';

export default combineReducers({
  auth: authDataReducer,
  managed_accounts: UserAccountLedgerReducer,
});

//export {actions}
export {setLocalAuthData, setSessionAuthData, clearLocalAuthData, setStateAuthData, clearSessionAuthData} from './auth';
export {setUserAccounts, unsetUserAccount, clearUserAccounts} from './managed-accounts';
