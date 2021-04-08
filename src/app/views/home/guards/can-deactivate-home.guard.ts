import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HomeComponent, TimerStatus } from '../home.component';

@Injectable()
export class CanDeactivateHomeGuard implements CanDeactivate<HomeComponent> {
  canDeactivate(component: HomeComponent): Observable<boolean> {
    if (component.currentTimerStatus === TimerStatus.RUNNING) {
      return component.openTimerInProgressDialog();
    }

    return of(true);
  }
}
