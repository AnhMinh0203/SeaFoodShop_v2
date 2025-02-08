// product-management/routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-management.component').then(m => m.ProductManagementComponent),
    data: {
      title: 'Quản lý sản phẩm'
    },
    children: [
      // Thêm route con ở đây
      {
        path: 'add-product',
        loadComponent: () => import('./add-product/add-product.component').then(m => m.AddProductComponent),
        data: {
          title: 'Thêm sản phẩm'
        }
      }
    ]
  }
];
