import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnimationsService {
  private static routeAnimationType: RouteAnimationType = 'ALL';

  constructor() {
    AnimationsService.routeAnimationType = 'ALL';
  }

  static isRouteAnimationsType(type: RouteAnimationType): boolean {
    return AnimationsService.routeAnimationType === type;
  }

  updateRouteAnimationType(pageAnimations: boolean, elementsAnimations: boolean): void {
    AnimationsService.routeAnimationType =
      pageAnimations && elementsAnimations ? 'ALL' : pageAnimations ? 'PAGE' : elementsAnimations ? 'ELEMENTS' : 'NONE';
  }
}

export type RouteAnimationType = 'ALL' | 'PAGE' | 'ELEMENTS' | 'NONE';
