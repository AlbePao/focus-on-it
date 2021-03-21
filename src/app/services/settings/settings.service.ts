import { Injectable } from '@angular/core';
import { Settings } from 'src/app/interfaces/settings';
import { LocalStorageService } from '../local-storage/local-storage.service';

const SETTINGS = 'SETTINGS';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private defaultSettings: Settings = {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    rounds: 4,
    autoStartNextRoundEnabled: true,
    timerInTitleEnabled: true,
    notificationsEnabled: false,
    darkModeEnabled: false,
  };

  constructor(private readonly localStorageService: LocalStorageService) {}

  getSettings(): Settings {
    const settings = this.localStorageService.getItem(SETTINGS) as Settings;

    if (!settings) {
      this.localStorageService.setItem(SETTINGS, this.defaultSettings);

      return this.defaultSettings;
    }

    return settings;
  }

  setSettings(settings: Settings): void {
    this.localStorageService.setItem(SETTINGS, settings);
  }
}