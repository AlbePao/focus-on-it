import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings/settings.service';

enum TimerType {
  WORK = 'Work',
  BREAK = 'Break',
}

enum TimerStatus {
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

  timerSpinnerValue = 100;

  currentDuration = this.settings.workDuration;
  currentTimerType: TimerType = TimerType.WORK;
  currentTimerStatus: TimerStatus = TimerStatus.STOPPED;
  currentTimerRound = 0;

  isStopButtonDisabled = true;
  toggleIcon = 'play_arrow';

  routerSubscription$ = new Subscription();

  countdownConfig: CountdownConfig = {
    demand: true,
    format: 'mm:ss',
    leftTime: this.currentDuration * 60,
    notify: 0,
  };

  constructor(
    private readonly router: Router,
    private readonly settingsService: SettingsService,
    private readonly title: Title,
  ) {}

  ngOnInit(): void {
    // TODO: alert if NavigationStart while timer is running
    // TODO: alert if browser tab is closed while timer is running
    this.routerSubscription$ = this.router.events.subscribe();
  }

  ngOnDestroy(): void {
    this.routerSubscription$.unsubscribe();

    if (this.settings.timerInTitleEnabled) {
      this.setTimerInTitle();
    }
  }

  timerChange(event: CountdownEvent): void {
    console.log(event);
    const secondsLeft = event.left / 1000;
    this.timerSpinnerValue = (secondsLeft * 100) / (this.currentDuration * 60);

    if (this.settings.timerInTitleEnabled) {
      this.setTimerInTitle(event.text);
    }

    if (event.action === 'done') {
      if (this.currentTimerType === TimerType.WORK) {
        this.currentTimerRound += 1;
      }
      // TODO: start next timer if roundsCounter < rounds
      // TODO: handle notification
    }
  }

  stopTimer(): void {
    // TODO: open confirm dialog
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
}
