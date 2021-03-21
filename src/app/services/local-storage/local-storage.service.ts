import { Injectable } from '@angular/core';

const APP_PREFIX = 'FOI-';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getItem(key: string): unknown {
    const item = localStorage.getItem(`${APP_PREFIX}${key}`);

    if (item) {
      return JSON.parse(item);
    }

    return null;
  }

  setItem(key: string, value: unknown): void {
    localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(`${APP_PREFIX}${key}`);
  }
}
