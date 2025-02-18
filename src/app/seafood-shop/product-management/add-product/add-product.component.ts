import { HttpClient, HttpClientModule } from '@angular/common/http';
import Quill from 'quill';
import { Component } from '@angular/core';
import { ButtonModule, CardModule, FormModule } from '@coreui/angular';
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
import { ProductService } from '../../service/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';



import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';

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
    SelectModule,
    Toast,
    InputNumberModule,
    TableModule,
    ConfirmDialogModule,
    ConfirmDialog,
    ToastModule,
    DialogModule,
    DatePickerModule

  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProductComponent {
  name: any;
  price: any;
  unit: any;
  categories: any;
  categorySelect: any;
  vouchers: any[] = [{ id: null, nameVoucher: 'Không có voucher' }];
  voucherSelect: any;
  quantity: any;
  instruct: any;
  origin: any;
  description: any;
  createBy: any;
  modifyBy: any;

  quill: any;
  delta: any;
  value: any;

  primaryImg: any;
  primaryImgDisplay: any;
  childrenImages: any[] = [];
  imageSrc: string = '';

  visibleCategoryForm: any;
  visibleVoucherForm: any;



  // Biến lưu trữ nội dung HTML an toàn
  contentHtml: SafeHtml = '';



  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
    private _productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,

  ) { }
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
    ['clean']
  ];

  ngOnInit() {
    this.getProductSelections();
  }

  ngAfterViewInit() {
    this.quill = new Quill('#editor', {
      modules: {
        toolbar: this.toolbarOptions
      },
      theme: 'snow',
      placeholder: 'Nhập mô tả sản phẩm...',
    });
  }


  onUploadPrimaryImg(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    this.primaryImg = file;
    reader.onload = (e: any) => {
      this.primaryImgDisplay = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  onUploadChildrenImg(event: any) {
    const files = Array.from(event.files) as File[];
    const newFiles = files.map((file) => ({
      file: file,
      previewUrl: URL.createObjectURL(file),
    }));

    // Nối các file mới vào mảng childrenImages hiện có
    this.childrenImages = [...this.childrenImages, ...newFiles];

    console.log(this.childrenImages);
  }


  onRemoveChildrenImg(event: any) {
    const file = event.file;
    const index = this.childrenImages.findIndex(item => item.file === file);

    if (index !== -1) {
      this.childrenImages.splice(index, 1); // Xóa ảnh khỏi mảng
    }
    console.log('After remove:', this.childrenImages);
  }

  navigateToProductManagement() {
    this.router.navigate(['/product-management']);
  }

  addProduct() {
    const formData = new FormData();

    // formData.append("Id", "0");
    formData.append("Name", this.name);
    formData.append("Price", this.price);
    formData.append("Unit", this.unit);
    formData.append("IdCategory", this.categorySelect.id);
    if (this.voucherSelect && this.voucherSelect.id !== null) {
      formData.append("IdVoucher", this.voucherSelect.id);
    }
    formData.append("Quantity", this.quantity);
    formData.append("Instruct", this.instruct);
    formData.append("Origin", this.origin);
    formData.append("Description", this.quill.root.innerHTML);
    formData.append("CreateBy", "admin");
    formData.append("CreateDate", new Date().toISOString());
    formData.append("ModifyBy", "admin");
    formData.append("ModifyDate", new Date().toISOString());

    // Gửi ảnh chính (primary image)
    if (this.primaryImg) {
      formData.append("PrimaryImg", this.primaryImg);
    }

    // Gửi danh sách ảnh con (children images)
    this.childrenImages.forEach((img) => {
      formData.append("ChildImg", img.file);
    });

    //  Gửi request xuống BE
    this._productService.addProduct(formData).subscribe((res: any) => {
      if (res && res.isSuccess == true) {
        this.messageService.add({ severity: "success", summary: "Success", detail: "Thêm sản phẩm thành công!" });
      } else {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Lỗi!" });
      }
    });
  }

  getProductSelections() {
    this._productService.getProductSelections().subscribe((res: any) => {
      if (res && res.isSuccess == true) {
        this.categories = res.data.categories;
        this.vouchers = [...this.vouchers, ...res.data.vouchers];

      }
      if (this.categories && this.categories.length > 0) {
        this.categorySelect = this.categories[0];
      }
      this.voucherSelect = this.vouchers[0];
    });
  }

  // Quản lý danh mục
  showCategoryForm() {
    this.visibleCategoryForm = true;
  }

  selectCategory() {
    alert('Chọn danh mục');
  }

  deleteCategory(category: any, event: Event) {
    if (!category.name || category.name.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Tên loại không hợp lệ, không thể xóa.'
      });
      return;
    }

    if (!category.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Bạn chưa cập nhật danh mục vào hệ thống. Vui lòng cập nhật trước khi xóa.'
      });
      return;
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Xác nhận xóa ?',
      header: 'Cảnh báo',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Hủy',
      rejectButtonProps: {
        label: 'Hủy',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Đồng ý',
        severity: 'danger',
      },

      accept: () => {
        this._productService.deleteCategory(category.name).subscribe((res: any) => {

          if (res && res.isSuccess == true) {
            this.getProductSelections();
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: res.data });
          }
        });
      },
      reject: () => {

      },
    });
  }

  addCategory() {
    this.categories.push({ name: '' });
  }

  addOrUpdateCategory() {
    const invalidCategories = this.categories.filter((c:any) => !c.name || c.name.trim() === "");

    if (invalidCategories.length > 0) {
      this.messageService.add({
        severity: "error",
        summary: "Lỗi",
        detail: "Tên loại không được để trống."
      });
      return; // Dừng lại, không gửi request lên API
    }

    this._productService.addOrUpdateCategory(this.categories).subscribe((res: any) => {
      if (res && res.isSuccess == true) {
        console.log(res);
        this.getProductSelections();
        this.messageService.add({ severity: "success", summary: "Success", detail: res.data });
      } else {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Lỗi!" });
      }
    });
  }

  // Quản lý voucher
  showVoucherForm() {
    this.visibleVoucherForm = true;
  }

  selectVoucher() {
    alert('Chọn danh mục');
  }

  deleteVoucher(voucher: any, event: Event) {
    if (!voucher.name || voucher.name.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Tên loại không hợp lệ, không thể xóa.'
      });
      return;
    }

    if (!voucher.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Bạn chưa cập nhật danh mục vào hệ thống. Vui lòng cập nhật trước khi xóa.'
      });
      return;
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Xác nhận xóa ?',
      header: 'Cảnh báo',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Hủy',
      rejectButtonProps: {
        label: 'Hủy',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Đồng ý',
        severity: 'danger',
      },

      accept: () => {
        this._productService.deleteVoucher(voucher.name).subscribe((res: any) => {

          if (res && res.isSuccess == true) {
            this.getProductSelections();
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: res.data });
          }
        });
      },
      reject: () => {

      },
    });
  }

  addVoucher() {
    this.categories.push({ name: '' });
  }

  addOrUpdateVoucher() {
    const invalidCategories = this.categories.filter((c:any) => !c.name || c.name.trim() === "");

    if (invalidCategories.length > 0) {
      this.messageService.add({
        severity: "error",
        summary: "Lỗi",
        detail: "Tên loại không được để trống."
      });
      return; // Dừng lại, không gửi request lên API
    }

    this._productService.addOrUpdateVoucher(this.vouchers).subscribe((res: any) => {
      if (res && res.isSuccess == true) {
        console.log(res);
        this.getProductSelections();
        this.messageService.add({ severity: "success", summary: "Success", detail: res.data });
      } else {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Lỗi!" });
      }
    });
  }

  formatDate(date: string): string {
    const d = new Date(date);
    const day = ("0" + d.getDate()).slice(-2);  // Lấy ngày và thêm số 0 nếu cần
    const month = ("0" + (d.getMonth() + 1)).slice(-2);  // Lấy tháng (tháng bắt đầu từ 0)
    const year = d.getFullYear();  // Lấy năm

    return `${day}/${month}/${year}`;
  }

}
