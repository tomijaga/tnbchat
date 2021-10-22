import {PayloadAction} from '@reduxjs/toolkit';
import {LocalStorageData, LocalStorageKeys, SessionStorageKeys, TNBChatAccount, UserAccount} from 'types';
import {localStore, sessionStore} from './storage';

const partialMapUpdater = (object: any, objectWithUpdatedValues: any, callback?: (key: string, value: any) => void) => {
  Object.keys(objectWithUpdatedValues).forEach((key: string) => {
    object[key] = objectWithUpdatedValues[key];
    callback?.(key, objectWithUpdatedValues[key]);
  });
};

export const setPartialStateReducer =
  <Type extends {[key: string]: any}>() =>
  (state: any, {payload}: PayloadAction<Partial<Type>>) => {
    partialMapUpdater(state, payload);
  };

export const setAccountReducer = <T>(state: any, {payload}: PayloadAction<T>) => {
  return payload;
};

export const setLocalAndPartialStateReducer =
  <T>(localStoreKey: LocalStorageKeys) =>
  (state: any, {payload}: PayloadAction<Partial<T>>) => {
    partialMapUpdater(state, payload);
    localStore.setItem(localStoreKey, state);
  };

export const setSessionAndPartialStateReducer =
  <T>(localStoreKey: SessionStorageKeys) =>
  (state: any, {payload}: PayloadAction<Partial<T>>) => {
    partialMapUpdater(state, payload);
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
