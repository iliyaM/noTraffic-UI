import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'polygon-playground',
    loadComponent: () => import('./pages/polygon-playground/polygon-playground.component').then(m => m.PolygonPlaygroundComponent),
  },
  {
    path: '**',
    redirectTo: 'polygon-playground'
  }
];
