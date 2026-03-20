import {computed, Injectable, signal} from '@angular/core';
import {AppSettings, DEFAULT_SETTINGS} from './settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'app-settings';
  private _settings = signal<AppSettings>(this.loadFromStorage());

  readonly settings = this._settings.asReadonly();
  readonly developerMode = computed(() => this._settings().developerMode);

  update(patch: Partial<AppSettings>): void {
    this._settings.update(current => {
      const updated = { ...current, ...patch };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  private loadFromStorage(): AppSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
}
