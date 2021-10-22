import {setStateAuthData, setLocalAuthData, setSessionAuthData} from 'store/app';
import {AppDispatch, AuthStatus, LocalAuthData, RootState} from 'types';
import {Aes} from 'utils';

const lockApp = (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(
    setSessionAuthData({
      appEncryptedUserPasswordHash: undefined,
    }),
  );
  dispatch(
    setStateAuthData({
      isLoggedIn: false,
      autoLockTimeoutId: undefined,
    }),
  );
};

const extendUnlockedPeriod = (dispatch: AppDispatch, getState: () => RootState) => {
  const {
    app: {
      auth: {
        state: {autoLockTimeoutId},
      },
    },
  } = getState();

  if (autoLockTimeoutId) {
    console.log('cleared Timeout', autoLockTimeoutId);
    clearTimeout(autoLockTimeoutId);
  }

  const timeoutId = setTimeout(() => {
    dispatch(lockApp);
  }, 1000 * 60 * 10);

  if (timeoutId) {
    console.log('changed Timeout id to', timeoutId);

    dispatch(
      setStateAuthData({
        autoLockTimeoutId: timeoutId,
      }),
    );
  }
};

export const verifyAuth = (dispatch: AppDispatch, getState: () => RootState) => {
  const {
    app: {auth},
  } = getState();

  console.log(auth);

  if (auth.session.appEncryptedUserPasswordHash) {
    console.log('appEncryptedUserPasswordHash', true);

    const aes = new Aes({hash: auth.session.appEncryptedUserPasswordHash});
    const decryptedSafetyText = aes.textDecryption(auth.local.encryptedSafetyText!);

    if (decryptedSafetyText === process.env.REACT_APP_SAFETY_TEXT) {
      console.log("Safety Text Matches the app's encrypted one");

      //extend unlocked Period
      dispatch(extendUnlockedPeriod);
      return true;
    } else {
      console.log({decryptedSafetyText});
      console.log('Safety_text Is not Correct');
      //wrong password or safety text was changed (highly unlikly)

      dispatch(setStateAuthData({authStatus: AuthStatus.verify_password, showAuthModal: true}));
    }
  } else {
    console.log('appEncryptedUserPasswordHash', false);

    if (!auth.local.encryptedSafetyText) {
      console.log('encryptedSafetyText', false);

      dispatch(setStateAuthData({authStatus: AuthStatus.register_password, showAuthModal: true}));
    } else {
      console.log('encryptedSafetyText', true);

      dispatch(setStateAuthData({authStatus: AuthStatus.verify_password, showAuthModal: true}));
    }
  }

  return false;
};

export const getCypherAlgorithm = (dispatch: AppDispatch, getState: () => RootState) => {
  if (dispatch(verifyAuth)) {
    const {
      app: {auth},
    } = getState();

    return new Aes({hash: auth.session.appEncryptedUserPasswordHash!});
  }
  return null;
};

export const registerPassword = (password: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  const cypherAlgorithm = new Aes({password: password});

  const appEncryptedUserPasswordHash = cypherAlgorithm.encryptedPasswordHash;
  const safetyText = process.env.REACT_APP_SAFETY_TEXT!;
  const encryptedSafetyText = cypherAlgorithm.textEncryption(safetyText)!;

  dispatch(
    setStateAuthData({
      authStatus: AuthStatus.create_account,
      isLoggedIn: true,
    }),
  );

  dispatch(
    setSessionAuthData({
      appEncryptedUserPasswordHash,
    }),
  );

  dispatch(
    setLocalAuthData({
      encryptedSafetyText,
    }),
  );

  //extend unlocked Period
  dispatch(extendUnlockedPeriod);
};

export const verifyPassword = (password: string) => (dispatch: AppDispatch, getState: () => RootState) => {
  const cypherAlgorithm = new Aes({password: password});
  const appEncryptedUserPasswordHash = cypherAlgorithm.encryptedPasswordHash;

  const {
    app: {
      auth: {
        local: {encryptedSafetyText},
      },
    },
  } = getState();

  const decryptedSafetyText = cypherAlgorithm.textDecryption(encryptedSafetyText)!;

  if (decryptedSafetyText === process.env.REACT_APP_SAFETY_TEXT) {
    dispatch(
      setSessionAuthData({
        appEncryptedUserPasswordHash,
      }),
    );

    //extend unlocked Period
    dispatch(extendUnlockedPeriod);

    return true;
  } else {
    throw new Error('verifyPassword: Password is Incorrect');
  }
};
