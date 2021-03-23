import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';

type ButtonColors = 'primary' | 'accent';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  @Input() duration = 0;
  @Output() countDownEvent = new EventEmitter<CountdownEvent>();
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;

  isTimerRunning?: boolean;
  buttonLabel = 'Start';
  buttonColor: ButtonColors = 'primary';
  countdownConfig: CountdownConfig = {};

  ngOnInit(): void {
    this.countdownConfig = {
      demand: true,
      format: 'mm:ss',
      leftTime: this.duration * 60,
      notify: 0,
    };
  }

  toggleTimer(): void {
    if (this.isTimerRunning) {
      this.countdown.pause();
      this.isTimerRunning = false;
      this.buttonLabel = 'Start';
      this.buttonColor = 'primary';
    } else {
      if (this.isTimerRunning === undefined) {
        this.countdown.begin();
      } else {
        this.countdown.resume();
      }

      this.isTimerRunning = true;
      this.buttonLabel = 'Pause';
      this.buttonColor = 'accent';
    }
  }

  handleEvent(event: CountdownEvent): void {
    console.log(event);
    this.countDownEvent.emit(event);
  }
}
