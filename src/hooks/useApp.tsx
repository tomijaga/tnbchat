import React, {useCallback} from 'react';
import {verifyAuth} from 'dispatchers';
import {useDispatch, useSelector} from 'react-redux';
import {getUserAccountManager} from 'selectors';

const useApp = () => {
  const dispatch = useDispatch();
  const tnbChatAccountManager = useSelector(getUserAccountManager);

  return {
    tnbchatSDK: tnbChatAccountManager ?? null,
    verifyUserAccount: useCallback(() => !!dispatch(verifyAuth), [dispatch]),
  };
};

export default useApp;
