import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkModeEnabled$ = new BehaviorSubject(false);

  constructor(private readonly overlay: OverlayContainer) {}

  getDarkModeEnabled(): Observable<boolean> {
    return this.isDarkModeEnabled$;
  }

  setDarkMode(isEnabled: boolean): void {
    this.isDarkModeEnabled$.next(isEnabled);

    if (isEnabled) {
      this.overlay.getContainerElement().classList.add('dark-theme');
    } else {
      this.overlay.getContainerElement().classList.remove('dark-theme');
    }
  }
}
