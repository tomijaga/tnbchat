import {PayloadAction} from '@reduxjs/toolkit';
import {AccountNumber, LocalStorageKeys, SessionStorageKeys} from 'types';
import {localStore, sessionStore} from './storage';

export const partialObjectUpdate = (
  object: any,
  objectWithUpdatedValues: any,
  callback?: (key: string, value: any) => void,
) => {
  Object.keys(objectWithUpdatedValues).forEach((key: string) => {
    object[key] = objectWithUpdatedValues[key];
    callback?.(key, objectWithUpdatedValues[key]);
  });
};

export const setPartialStateReducer =
  <Type extends {[key: string]: any}>() =>
  (state: any, {payload}: PayloadAction<Partial<Type>>) => {
    partialObjectUpdate(state, payload);
    console.log({state, payload});
    console.log('state', JSON.stringify(state));
  };

export const setAccountNumberReducer =
  <T extends AccountNumber>() =>
  (state: any, {payload}: PayloadAction<T>) => {
    const {account_number} = payload;
    const accountNumberData = state[account_number];
    if (accountNumberData) {
      partialObjectUpdate(accountNumberData, payload);
    } else {
      state[account_number] = payload;
    }
  };

export const unsetAccountNumberReducer =
  () =>
  (state: any, {payload}: PayloadAction<AccountNumber>) => {
    const {account_number} = payload;
    delete state[account_number];
  };

export const setLocalAndPartialStateReducer =
  <T>(localStoreKey: LocalStorageKeys) =>
  (state: any, {payload}: PayloadAction<Partial<T>>) => {
    console.log({state, payload});
    partialObjectUpdate(state, payload);
    localStore.setItem(localStoreKey, state);
  };

export const setSessionAndPartialStateReducer =
  <T>(localStoreKey: SessionStorageKeys) =>
  (state: any, {payload}: PayloadAction<Partial<T>>) => {
    partialObjectUpdate(state, payload);
    sessionStore.setItem(localStoreKey, state);
  };

export const unsetLocalAndStateReducer =
  (localStoreKey: LocalStorageKeys) =>
  (state: any, {payload}: PayloadAction<Array<string>>) => {
    if (Array.isArray(payload)) {
      payload.forEach((key: string) => {
        delete state[key];
      });
    } else {
      delete state[payload];
    }

    localStore.setItem(localStoreKey, state);
  };

export const clearLocalAndStateReducer =
  <T>(localStoreKey: LocalStorageKeys, initState?: T) =>
  () => {
    console.log('entered clearLocalAndStateReducer');
    console.log({localStoreKey});
    localStore.removeItem(localStoreKey);

    return initState || ({} as T);
  };

export const clearSessionAndStateReducer =
  <T>(sessionStoreKey: SessionStorageKeys, initState?: T) =>
  () => {
    sessionStore.removeItem(sessionStoreKey);
    return initState || ({} as T);
  };
