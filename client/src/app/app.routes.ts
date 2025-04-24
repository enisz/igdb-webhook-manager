import { Routes } from '@angular/router';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'webhooks' },
    { path: 'webhooks', loadComponent: () => import('./components/webhooks/webhooks.component').then(m => m.WebhooksComponent) },
    { path: 'webhook/:webhookId', loadComponent: () => import('./components/webhook/webhook.component').then(m => m.WebhookComponent), canDeactivate: [CanDeactivateGuard] },
];
