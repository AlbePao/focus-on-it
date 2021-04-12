import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import browser from 'browser-detect';
import { AppIcons } from './interfaces/app-icons';
import { AnimationsService } from './services/animations/animations.service';
import { routeAnimations } from './services/animations/route.animations';
import { SettingsService } from './services/settings/settings.service';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
})
export class AppComponent implements OnInit {
  settings = this.settingsService.getSettings();
  isDarkModeEnabled$ = this.themeService.getDarkModeEnabled();

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
    private readonly animationsService: AnimationsService,
    private readonly settingsService: SettingsService,
    private readonly themeService: ThemeService,
  ) {
    this.registerIcons();
  }

  ngOnInit(): void {
    this.themeService.setDarkMode(this.settings.darkModeEnabled);

    const isIEorEdgeOrSafari = ['ie', 'edge', 'safari'].includes(browser().name ?? '');

    this.animationsService.updateRouteAnimationType(!isIEorEdgeOrSafari, true);
  }

  private registerIcons(): void {
    Object.keys(AppIcons).forEach((icon) => {
      this.matIconRegistry.addSvgIcon(icon, this.sanitizer.bypassSecurityTrustResourceUrl(`assets/svg/${icon}.svg`));
    });
  }
}
