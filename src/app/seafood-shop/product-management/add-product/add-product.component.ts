import { HttpClient, HttpClientModule } from '@angular/common/http';
import Quill from 'quill';
import { Component } from '@angular/core';
import { ButtonModule, CardModule,FormModule } from '@coreui/angular';
import { ButtonModule as PrimeUIButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ViewEncapsulation } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [
    ButtonModule,
    CardModule,
    FormModule,
    PrimeUIButtonModule,
    FileUploadModule,
    HttpClientModule,
    CommonModule,
    ImageModule,
    FormsModule,
    InputTextModule,
    EditorModule,
    SelectModule
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProductComponent {
  uploadedFiles: any[] = [];
  primaryImg: any;
  imageSrc: string = '';
  value: any;
  title = 'User';
  quill: any;
  delta: any;

  // Biến lưu trữ nội dung HTML an toàn
  contentHtml: SafeHtml = '';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router

  ) {}
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

  ngAfterViewInit() {
    this.quill = new Quill('#editor', {
      modules: {
        toolbar: this.toolbarOptions
      },
      theme: 'snow',
      placeholder: 'Nhập mô tả sản phẩm...',
    });
  }

  showContent() {
    // Lấy nội dung HTML từ Quill editor và sanitize
    this.contentHtml = this.sanitizer.bypassSecurityTrustHtml(this.quill.root.innerHTML);
    console.log(this.contentHtml);
  }
  // Phương thức xử lý upload file
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

  navigateToProductManagement() {
    this.router.navigate(['/product-management']);
  }

}
