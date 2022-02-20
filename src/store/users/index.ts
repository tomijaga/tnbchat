import {combineReducers} from '@reduxjs/toolkit';

// import reducer, {actions}
import accountBalancesReducer from './balances';
import profilesReducer from './profiles';

export default combineReducers({
  balances: accountBalancesReducer,
  profiles: profilesReducer,
});

//export {actions}
export {setAccountBalance, unsetAccountBalance} from './balances';
export {setUserProfile} from './profiles';
