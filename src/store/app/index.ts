import {combineReducers} from '@reduxjs/toolkit';

// import reducer, {actions}
import authDataReducer, {setAuthData} from './auth';

export default combineReducers({
  auth: authDataReducer,
});

export {setAuthData};
