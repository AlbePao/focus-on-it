import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateHomeGuard } from './guards/can-deactivate-home.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [{ path: '', component: HomeComponent, canDeactivate: [CanDeactivateHomeGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
