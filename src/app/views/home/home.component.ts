import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { defer, iif, Observable, of, Subject, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { DialogAlertComponent } from './dialog-alert/dialog-alert.component';

export enum TimerType {
  WORK = 'Work',
  BREAK = 'Break',
}

export enum TimerStatus {
  RUNNING,
  PAUSED,
  STOPPED,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;

  settings = this.settingsService.getSettings();

  currentTimerType: TimerType = TimerType.WORK;
  currentTimerStatus: TimerStatus = TimerStatus.STOPPED;
  currentRound = 0;
  currentSpinnerValue = 100;

  isStopButtonDisabled = true;
  toggleIcon = 'play_arrow';

  // TODO: alert if browser tab is closed while timer is running
  timerStopAction$ = new Subject<void>();
  timerStopInteraction$ = this.timerStopAction$.pipe(
    switchMap(() =>
      iif(() => this.currentTimerStatus === TimerStatus.RUNNING, this.openTimerInProgressDialog(), of(true)),
    ),
    filter((result) => !!result),
    tap(() => this.stopTimer()),
  );

  timerCompletionAction$ = new Subject<void>();
  timerCompletionInteraction$ = this.timerCompletionAction$.pipe(switchMap(() => this.openTimerCompletionDialog()));

  timerStopSubscrption$ = new Subscription();
  timerCompletionSubscription$ = new Subscription();

  countdownConfig: CountdownConfig = {
    demand: true,
    format: 'mm:ss',
    leftTime: this.settings.workDuration * 60,
    notify: 0,
  };

  @HostListener('window:beforeunload', ['$event'])
  onWindowClose(): boolean {
    if (this.currentTimerStatus === TimerStatus.RUNNING) {
      return false;
    }

    return true;
  }

  constructor(
    private readonly dialog: MatDialog,
    private readonly title: Title,
    private readonly settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.timerStopSubscrption$ = this.timerStopInteraction$.subscribe();
    this.timerCompletionSubscription$ = this.timerCompletionInteraction$.subscribe();
  }

  ngOnDestroy(): void {
    this.timerStopSubscrption$.unsubscribe();
    this.timerCompletionSubscription$.unsubscribe();

    if (this.settings.timerInTitleEnabled) {
      this.setTimerInTitle();
    }
  }

  timerChange(event: CountdownEvent): void {
    const { text, action, left } = event;
    const { workDuration, breakDuration, rounds } = this.settings;

    if (this.settings.timerInTitleEnabled) {
      this.setTimerInTitle(text);
    }

    if (action === 'restart' && this.currentRound < rounds) {
      this.toggleTimer();
    } else if (action === 'done') {
      // TODO: handle notification and play timer ring
      this.stopTimer();

      if (this.currentTimerType === TimerType.WORK) {
        this.currentRound += 1;

        if (this.currentRound >= rounds) {
          this.timerCompletionAction$.next();

          this.countdownConfig = { ...this.countdownConfig, leftTime: workDuration * 60 };
          this.currentTimerType = TimerType.WORK;
        } else {
          this.countdownConfig = { ...this.countdownConfig, leftTime: breakDuration * 60 };
          this.currentTimerType = TimerType.BREAK;
        }
      } else {
        this.countdownConfig = { ...this.countdownConfig, leftTime: workDuration * 60 };
        this.currentTimerType = TimerType.WORK;
      }
    } else {
      const currentDuration = (this.currentTimerType === TimerType.WORK ? workDuration : breakDuration) * 60;
      const secondsLeft = left / 1000;
      this.currentSpinnerValue = (secondsLeft * 100) / currentDuration;
    }
  }

  stopTimer(): void {
    this.countdown.stop();
    this.countdown.restart();
    this.currentTimerStatus = TimerStatus.STOPPED;
    this.isStopButtonDisabled = true;
    this.toggleIcon = 'play_arrow';
  }

  toggleTimer(): void {
    if (this.currentTimerStatus === TimerStatus.RUNNING) {
      this.countdown.pause();
      this.currentTimerStatus = TimerStatus.PAUSED;
      this.toggleIcon = 'play_arrow';
    } else if (this.currentTimerStatus === TimerStatus.PAUSED) {
      this.countdown.resume();
      this.currentTimerStatus = TimerStatus.RUNNING;
      this.toggleIcon = 'pause';
    } else if (this.currentTimerStatus === TimerStatus.STOPPED) {
      this.countdown.begin();
      this.currentTimerStatus = TimerStatus.RUNNING;
      this.toggleIcon = 'pause';
      this.isStopButtonDisabled = false;
    }
  }

  setTimerInTitle(duration?: string): void {
    this.title.setTitle(`${duration ? duration + ' - ' : ''}Focus on It`);
  }

  openTimerInProgressDialog(): Observable<boolean> {
    return defer(() =>
      this.dialog
        .open(DialogAlertComponent, {
          disableClose: true,
          width: '20rem',
          height: 'auto',
          data: {
            title: 'Warning',
            description: 'Are you sure you want to stop timer? All your progress will be lost',
            cancelOrConfirm: true,
          },
        })
        .afterClosed(),
    );
  }

  openTimerCompletionDialog(): Observable<void> {
    return defer(() =>
      this.dialog
        .open(DialogAlertComponent, {
          disableClose: true,
          width: '20rem',
          height: 'auto',
          data: { description: 'Work completed' },
        })
        .afterClosed(),
    );
  }
}
