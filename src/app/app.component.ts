import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import browser from 'browser-detect';
import { AnimationsService } from './services/animations/animations.service';
import { routeAnimations } from './services/animations/route.animations';

enum AppIcons {
  info,
  settings,
  stop,
  play_arrow,
  pause,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
})
export class AppComponent implements OnInit {
  constructor(
    private readonly animationsService: AnimationsService,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.registerIcons();
  }

  ngOnInit(): void {
    const isIEorEdgeOrSafari = ['ie', 'edge', 'safari'].includes(browser().name ?? '');

    this.animationsService.updateRouteAnimationType(!isIEorEdgeOrSafari, true);
  }

  private registerIcons(): void {
    Object.keys(AppIcons).forEach((icon) => {
      this.matIconRegistry.addSvgIcon(icon, this.sanitizer.bypassSecurityTrustResourceUrl(`assets/${icon}.svg`));
    });
  }
}
