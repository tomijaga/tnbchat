import {configureStore} from '@reduxjs/toolkit';

import appReducer from './app';
import directMessagesReducer from './messages';
import tnbAccountsReducer from './users';

const store = configureStore({
  reducer: {
    users: tnbAccountsReducer,
    app: appReducer,
    directMessages: directMessagesReducer,
  },
});

export * from './app';
export * from './users';

export default store;
