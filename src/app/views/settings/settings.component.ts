import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  formSubscription$ = new Subscription();

  form = this.fb.group({
    workDuration: [null],
    shortBreak: [null],
    longBreak: [null],
    rounds: [null],
    autoStartNextRoundEnabled: [null],
    timerInTitleEnabled: [null],
    notificationsEnabled: [null],
    darkModeEnabled: [null],
  });

  settings = this.settingsService.getSettings();

  constructor(private readonly fb: FormBuilder, private readonly settingsService: SettingsService) {}

  ngOnInit(): void {
    this.form.patchValue(this.settings, { emitEvent: false });

    this.formSubscription$ = this.form.valueChanges.subscribe((settings) => this.settingsService.setSettings(settings));
  }

  ngOnDestroy(): void {
    this.formSubscription$.unsubscribe();
  }

  resetSettings(): void {
    this.form.patchValue(this.settingsService.getDefaultSettings());
  }
}
