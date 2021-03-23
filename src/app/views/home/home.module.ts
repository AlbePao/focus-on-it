import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { CountdownModule } from 'ngx-countdown';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [HomeComponent, TimerComponent],
  imports: [CommonModule, MatButtonModule, MatTabsModule, HomeRoutingModule, CountdownModule, MatProgressBarModule],
})
export class HomeModule {}
