import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MessageData} from 'api/message';
import {DIRECT_MESSAGES, USER_ACCOUNTS} from 'constant';
import {Dict, PartialBy, DirectMessage} from 'types';
import {localStore} from 'utils/storage';
import {setLocalAndPartialStateReducer, clearLocalAndStateReducer, unsetLocalAndStateReducer} from 'utils/store';

type PartialDirectMessage = PartialBy<DirectMessage, 'last_viewed_date'>;

const storedMessages = localStore.getItem('direct_messages') as Dict<Dict<DirectMessage>>;

const initState = {};

const directMessages = createSlice({
  initialState: storedMessages || (initState as Dict<Dict<DirectMessage>>),
  name: DIRECT_MESSAGES,
  reducers: {
    setNewDirectMessage: (
      state: Dict<Dict<DirectMessage>>,
      action: PayloadAction<PartialDirectMessage & {user: string}>,
    ) => {
      const {user: userAccount, recipient, contents, retrieved_data} = action.payload;

      const prevPayload = {...{recipient, contents, retrieved_data}, last_viewed_date: Date.now()};

      const localStoragePayload = {...prevPayload, contents: []};
      delete localStoragePayload.retrieved_data;

      state = {
        ...state,
        ...{[userAccount]: {...state[userAccount], [recipient]: prevPayload}},
      };

      const localState = {
        ...state,
        ...{[userAccount]: {...state[userAccount], [recipient]: localStoragePayload}},
      };

      localStore.setItem('direct_messages', localState);
    },

    updateLastViewedMessage: (
      state: Dict<Dict<DirectMessage>>,
      {payload: {user, recipient}}: PayloadAction<{user: string; recipient: string}>,
    ) => {
      const personalMessages = state[user];

      state[user][recipient].last_viewed_date = Date.now();

      const messagesWithRecipient = personalMessages[recipient];
      const total = messagesWithRecipient.contents.length;

      localStore.setItem('direct_messages', state);
    },

    updateStoredMessages: (state: Dict<Dict<DirectMessage>>, action: PayloadAction<PartialDirectMessage>) => {
      const {recipient, contents} = action.payload;
    },
  },
});

export const {setNewDirectMessage, updateLastViewedMessage} = directMessages.actions;
export default directMessages.reducer;
