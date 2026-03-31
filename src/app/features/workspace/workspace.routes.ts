import { Routes } from '@angular/router';

import { WorkspaceComponent } from './workspace.component';
import { WorkspacePlaceholderComponent } from './workspace-placeholder.component';

export const WORKSPACE_ROUTES: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      { path: 'dashboard', component: WorkspacePlaceholderComponent },
      { path: 'brand-identity', loadComponent: () => import('./brand-identity/brand-identity-page.component').then((m) => m.BrandIdentityPageComponent) },
      { path: 'editorial-plan', component: WorkspacePlaceholderComponent },
      { path: 'copy-library', component: WorkspacePlaceholderComponent },
      { path: 'marketing-strategy', component: WorkspacePlaceholderComponent },
      { path: 'assets', component: WorkspacePlaceholderComponent },
      { path: 'tasks', component: WorkspacePlaceholderComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
];
