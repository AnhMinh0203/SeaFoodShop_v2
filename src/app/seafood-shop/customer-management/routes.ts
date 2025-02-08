import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./customer-management.component').then(m => m.CustomerManagementComponent),
    data: {
      title: 'Quản lý khách hàng'
    }
  }
];

