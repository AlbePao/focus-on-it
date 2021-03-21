import { Component, OnInit } from '@angular/core';
import browser from 'browser-detect';
import { AnimationsService } from './services/animations/animations.service';
import { routeAnimations } from './services/animations/route.animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
})
export class AppComponent implements OnInit {
  constructor(private readonly animationsService: AnimationsService) {}

  ngOnInit(): void {
    const isIEorEdgeOrSafari = ['ie', 'edge', 'safari'].includes(browser().name ?? '');

    this.animationsService.updateRouteAnimationType(!isIEorEdgeOrSafari, true);
  }
}
