import {LocalStorageData, SessionStorageData} from 'types';

export class StorageTS<StoredMap> {
  storage: Storage;

  constructor(storage: any) {
    this.storage = storage;
  }
  getItem(key: keyof StoredMap): StoredMap[typeof key] | null {
    const item = this.storage.getItem(key as string);
    if (item === null) return null;

    return JSON.parse(item);
  }

  setItem(key: keyof StoredMap, value: StoredMap[typeof key]): void {
    this.storage.setItem(key as string, JSON.stringify(value));
  }

  removeItem(key: keyof StoredMap) {
    this.storage.removeItem(key as string);
  }
}

export const localStore = new StorageTS<LocalStorageData>(localStorage);

export const sessionStore = new StorageTS<SessionStorageData>(sessionStorage);
