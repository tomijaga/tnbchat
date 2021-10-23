import {LocalStorageData, SessionStorageData} from 'types';

export class StorageTS<StoredMap> {
  storage: Storage;

  constructor(storage: any) {
    this.storage = storage;
  }
  getItem<T>(key: keyof StoredMap): T | null {
    const item = this.storage.getItem(key as string);
    if (item === null) return null;

    return JSON.parse(item);
  }

  setItem(key: keyof StoredMap, value: StoredMap[keyof StoredMap]): void {
    this.storage.setItem(key as string, JSON.stringify(value));
  }

  removeItem(key: keyof StoredMap) {
    this.storage.removeItem(key as string);
  }
}

export const localStore = new StorageTS<LocalStorageData>(localStorage);

export const sessionStore = new StorageTS<SessionStorageData>(sessionStorage);
