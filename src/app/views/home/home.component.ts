import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { defer, iif, Observable, of, Subject, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { TimerStatus, TimerType } from 'src/app/interfaces/timer';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { DialogAlertComponent } from './dialog-alert/dialog-alert.component';

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

  timerAlarm = new Audio();

  timerStopAction$ = new Subject<void>();
  timerStopInteraction$ = this.timerStopAction$.pipe(
    switchMap(() =>
      iif(() => this.currentTimerStatus !== TimerStatus.STOPPED, this.openTimerInProgressDialog(), of(true)),
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
    this.timerAlarm.play();
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
    const { workDuration, breakDuration, rounds, timerInTitleEnabled } = this.settings;

    if (timerInTitleEnabled) {
      this.setTimerInTitle(text);
    }

    if (action === 'restart' && this.currentRound < rounds) {
      this.toggleTimer();
    } else if (action === 'done') {
      this.stopTimer();

      this.timerAlarm.src = '../../../assets/alarm.mp3';
      this.timerAlarm.play();

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
            title: 'HOME.TIMER_IN_PROGRESS_TITLE',
            description: 'HOME.TIMER_IN_PROGRESS_DESCRIPTION',
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
          data: { description: 'HOME.WORK_COMPLETED' },
        })
        .afterClosed(),
    );
  }
}
