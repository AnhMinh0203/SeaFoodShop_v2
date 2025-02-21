import { Component, AfterViewInit, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { ButtonModule, CardModule, FormModule } from '@coreui/angular';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { ButtonModule as PrimeUIButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { DialogModule } from 'primeng/dialog';



import { HttpClient, HttpClientModule } from '@angular/common/http';
import Quill from 'quill';

import { FileUpload, FileUploadModule } from 'primeng/fileupload';

import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectModule } from 'primeng/select';
// ---
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProductService } from '../service/product.service';
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
  standalone: true,
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
    CommonModule,
    DialogModule,
    SelectModule,
    EditorModule,
    FileUploadModule,
    ImageModule,
    FormsModule,
    InputTextModule,
    HttpClientModule,
    ConfirmDialog,
    ToastModule,


  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss',
  encapsulation: ViewEncapsulation.None
})


export class ProductManagementComponent {
  @ViewChild('fileUploader') fileUploader!: FileUpload;
  first: number = 0;
  rows: number = 10;
  isAddProductPage: boolean = false;
  visible: boolean = false;
  value: any;

  uploadedFiles: any[] = [];
  primaryImg: any;
  imageSrc: string = '';
  title = 'User';
  quill: any;
  delta: any;
  contentHtml: SafeHtml = '';
  editorInstance: any;

  products!: Product[];
  productSelect: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _productService: ProductService
  ) {
    this.router.events.subscribe(() => {
      this.isAddProductPage = this.router.url.includes('/product-management/add-product');
    });
  }

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']  // remove formatting button
  ];

  ngOnInit() {
    this.loadProducts();
    this.loadExistingImages();
  }

  ngAfterViewChecked() {
    if (this.visible) {
      setTimeout(() => {
        if (!this.editorInstance) { // Đảm bảo không khởi tạo nhiều lần
          this.initializeQuill();
        }
      }, 100); // Đợi một khoảng thời gian để DOM cập nhật
    }
  }

  initializeQuill() {
    const quillContainer = document.getElementById('editorProductManagement');
    if (quillContainer) {
      this.editorInstance = new Quill(quillContainer, {
        theme: 'snow',
        placeholder: 'Nhập mô tả sản phẩm...',
      });
    }
  }

  showContent() {
    // Lấy nội dung HTML từ Quill editor và sanitize
    this.contentHtml = this.sanitizer.bypassSecurityTrustHtml(this.quill.root.innerHTML);
    console.log(this.contentHtml);
  }



  showDialog(product: any) {
    this.productSelect = { ...product };
    this.visible = true;
  }
  navigateToAddProduct() {
    this.router.navigate(['/product-management/add-product']);
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;  // Đảm bảo giá trị không bị undefined
    this.rows = event.rows ?? 10;   // Đảm bảo giá trị không bị undefined
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

  onUpload(event: any) {
    const file = event.files[0]; // Get the uploaded file

    // Create a URL for the uploaded image file
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.primaryImg = e.target.result; // Set the image source to the uploaded file's data URL
      console.log('Image Source:', this.primaryImg); // Check the image source in the console
    };
    reader.readAsDataURL(file); // Convert the file to a data URL for image preview
  }
  confirm_delete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Xác nhận xóa sản phẩm ',
      header: 'Cảnh báo',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Hủy bỏ',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Đồng ý',
        severity: 'danger',
      },

      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }


  loadProducts() {
    this.productSelect = {
      name: '',
      price: 0,
      origin: '',
      quantity: 0,
      guide: '',
      unit: '',
    };
    this._productService.getProducts().subscribe((data: any) => {
      if (data) {
        this.products = data;
      }
    });
  }

  loadExistingImages() {
    if (this.fileUploader && this.productSelect.childrenImg.length > 0) {
      this.productSelect.childrenImg.forEach((url: any) => {
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], url.split('/').pop() || 'image.jpg', { type: blob.type });
            this.fileUploader.files.push(file);
          });
      });
    }
  }

  removeImage(index: number) {
    this.productSelect.childrenImg.splice(index, 1);
}
  onFileSelect(event: any) {

  }
}
