import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'info',
    loadChildren: () => import('./views/info/info.module').then((m) => m.InfoModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./views/settings/settings.module').then((m) => m.SettingsModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
