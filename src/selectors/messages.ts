import {createSelector} from '@reduxjs/toolkit';
import {RootState, UserAccount} from 'types';
import {getUserAccount} from './userAccounts';

export const getAllAccountsDirectMessages = (state: RootState) => state.directMessages;

export const getSelectedAccountDirectMessages = createSelector(
  [getAllAccountsDirectMessages, getUserAccount],
  (allAccountsDirectMessages, selected_account) => {
    if (!selected_account) return null;
    const {account_number} = selected_account;

    return allAccountsDirectMessages[account_number];
  },
);

export const getDirectMessageRecipients = createSelector([getSelectedAccountDirectMessages], (directMessages) => {
  if (!directMessages) return null;

  const directMessagesArray = Object.values(directMessages);
  const recipients = directMessagesArray.map(({recipient, last_viewed_date, contents}) => {
    const total = contents.length;

    let last_viewed_index: number = total;

    if (last_viewed_date) last_viewed_date = new Date('12/20/2021').getTime();
    for (let i = total - 1; i >= 0; i -= 1) {
      const {
        block: {created_date},
      } = contents[i];

      if (new Date(last_viewed_date).getTime() > new Date(created_date).getTime()) {
        break;
      } else {
        last_viewed_index -= 1;
      }
    }

    return {
      recipient,
      latest_message: contents[total - 1],
      unseen_messages: total - last_viewed_index,
    };
  });

  recipients.sort(
    (
      {
        latest_message: {
          block: {created_date: a},
        },
      },
      {
        latest_message: {
          block: {created_date: b},
        },
      },
    ) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return recipients;
});

export const getAllDirectMessagesWithRecipient = (recipient: string) =>
  createSelector([getSelectedAccountDirectMessages], (directMessages) => {
    if (!directMessages) return null;

    return directMessages[recipient];
  });
