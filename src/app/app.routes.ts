import { Routes } from '@angular/router';

import { HealthHomeComponent } from './features/health/health-home.component';

export const routes: Routes = [
	{
		path: '',
		component: HealthHomeComponent,
	},
	{
		path: 'clients',
		loadChildren: () => import('./features/clients/clients.routes').then((m) => m.CLIENTS_ROUTES),
	},
];
