import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CountdownModule } from 'ngx-countdown';
import { DialogAlertComponent } from './dialog-alert/dialog-alert.component';
import { CanDeactivateHomeGuard } from './guards/can-deactivate-home.guard';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent, DialogAlertComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CountdownModule,
  ],
  providers: [CanDeactivateHomeGuard],
})
export class HomeModule {}
