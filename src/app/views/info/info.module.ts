import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InfoRoutingModule } from './info-routing.module';
import { InfoComponent } from './info.component';

@NgModule({
  declarations: [InfoComponent],
  imports: [CommonModule, InfoRoutingModule],
})
export class InfoModule {}
