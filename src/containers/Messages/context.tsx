import {createContext} from 'react';

export const MessagePageContext = createContext(
  {} as {
    recipient: string;
    setRecipient: (value: string) => void;
    showSelectRecipientModal: boolean;
    setShowSelectRecipientModal: (value: boolean) => void;
  },
);
