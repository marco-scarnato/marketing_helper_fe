import { Routes } from '@angular/router';

import { WorkspaceHomeComponent } from './features/workspace/workspace-home.component';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		canMatch: [() => !!localStorage.getItem('active_client_id')],
		redirectTo: 'workspace/dashboard',
	},
	{
		path: '',
		component: WorkspaceHomeComponent,
	},
	{
		path: 'clients',
		loadChildren: () => import('./features/clients/clients.routes').then((m) => m.CLIENTS_ROUTES),
	},
	{
		path: 'workspace',
		loadChildren: () => import('./features/workspace/workspace.routes').then((m) => m.WORKSPACE_ROUTES),
	},
];
