import {PayloadAction} from '@reduxjs/toolkit';

export const setObjectsReducer =
  <Type extends {[key: string]: any}>() =>
  (state: any, {payload}: PayloadAction<Partial<Type>>) => {
    Object.keys(payload).forEach((key: string) => {
      state[key] = payload[key];
    });
  };
