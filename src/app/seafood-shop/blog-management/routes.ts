import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./blog-management.component').then(m => m.BlogManagementComponent),
    data: {
      title: 'Quản lý Blog'
    }
  }
];

