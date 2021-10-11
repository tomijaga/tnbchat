import {LocalStorageData} from 'types';

type LocalStorageKeys = keyof LocalStorageData;

export class LocalStorage {
  getItem<T>(key: LocalStorageKeys): T | null {
    const item = localStorage.getItem(key);
    if (item === null) return null;

    return JSON.parse(item);
  }

  setItem(key: LocalStorageKeys, value: LocalStorageData[LocalStorageKeys]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
