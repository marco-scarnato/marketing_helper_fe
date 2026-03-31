import { Routes } from '@angular/router';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./list').then((m) => m.ClientListComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./form').then((m) => m.ClientFormComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./detail').then((m) => m.ClientDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./form').then((m) => m.ClientFormComponent),
  },
];
