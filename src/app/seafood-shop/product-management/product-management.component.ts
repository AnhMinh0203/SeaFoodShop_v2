import { Component } from '@angular/core';
import { ButtonModule, CardModule,FormModule } from '@coreui/angular';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { ButtonModule as PrimeUIButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorState } from 'primeng/paginator';
import { InputGroup } from 'primeng/inputgroup';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-product-management',
  imports: [
    CardModule,
    ButtonModule,
    TableModule,
    RatingModule,
    PrimeUIButtonModule,
    TagModule,
    PaginatorModule,
    FormModule,
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss'
})


export class ProductManagementComponent {

  first: number = 0;
  rows: number = 10;
  isAddProductPage: boolean = false;
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isAddProductPage = this.router.url.includes('/product-management/add-product');
    });
  }

  navigateToAddProduct() {
    this.router.navigate(['/product-management/add-product']);
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;  // Đảm bảo giá trị không bị undefined
    this.rows = event.rows ?? 10;   // Đảm bảo giá trị không bị undefined
  }
  product: Product = {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  };
  products!: Product[];

  ngOnInit() {
    this.products = [this.product]; // Thêm sản phẩm vào danh sách để hiển thị
  }

  getSeverity(status: string): "success" | "danger" | "warn" | undefined {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return undefined; // Trả về undefined để tránh lỗi
    }
  }

}
