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


interface Voucher {
  id?: number;
  nameVoucher: string;
  percent: number;
  startDate: Date;
  endDate: Date;
  createDate: Date;
  createBy: string;
  modifyDate?: Date;
  modifyBy: string;
}

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
  vouchers: Array<Voucher> = [];

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
    const maxSizeKB = 1000;
    console.log(file.size);
    if (file.size / 1024 > maxSizeKB){ // 1mb
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Kích thước ảnh không được lớn hơn 1MB'
      });
      return ;
    }

    const reader = new FileReader();
    this.primaryImg = file;
    reader.onload = (e: any) => {
      this.primaryImgDisplay = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  // onUploadChildrenImg(event: any) {
  //   const files = Array.from(event.files) as File[];
  //   const newFiles = files.map((file) => ({
  //     file: file,
  //     previewUrl: URL.createObjectURL(file),
  //   }));

  //   // Nối các file mới vào mảng childrenImages hiện có
  //   this.childrenImages = [...this.childrenImages, ...newFiles];

  //   console.log(this.childrenImages);
  // }

  onUploadChildrenImg(event: any) {
    const maxSizeKB = 1000;
    const files = Array.from(event.files) as File[];

    const newFiles = files
      .filter((file) => {
        if (file.size / 1024 > maxSizeKB) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Cảnh báo',
            detail: 'Kích thước ảnh không được lớn hơn 1MB'
          });
          return false;
        }
        return true;
      })
      .map((file) => ({
        file: file,
        previewUrl: URL.createObjectURL(file),
      }));

    // Giữ nguyên danh sách ảnh đã chọn trước đó
    this.childrenImages = [...this.childrenImages, ...newFiles];

    console.log("Danh sách ảnh hiện tại:", this.childrenImages);
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

  showWarning(message: string) {
    this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: message });
  }

  addProduct() {
    if (!this.name || this.name.trim() === "") {
      this.showWarning("Tên sản phẩm không được để trống!");
      return;
    }
    if (!this.price || isNaN(this.price) || this.price <= 0) {
      this.showWarning("Giá sản phẩm không hợp lệ!");
      return;
    }
    if (!this.unit || this.unit.trim() === "") {
      this.showWarning("Đơn vị không được để trống!");
      return;
    }

    if (!this.quantity || isNaN(this.quantity) || this.quantity < 0) {
      this.showWarning("Số lượng sản phẩm không hợp lệ!");
      return;
    }
    if (!this.instruct || this.instruct.trim() === "") {
      this.showWarning("Hướng dẫn sử dụng không được để trống!");
      return;
    }

    if (!this.origin || this.origin.trim() === "") {
      this.showWarning("Xuất xứ không được để trống!");
      return;
    }
    if (!this.quill.root.innerHTML || this.quill.root.innerHTML.trim() === "<p><br></p>") {
      this.showWarning("Mô tả sản phẩm không được để trống!");
      return;
    }

    if (!this.primaryImg) {
      this.showWarning("Vui lòng chọn ảnh chính cho sản phẩm!");
      return;
    }

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
        this.vouchers = res.data.vouchers.map((voucher:Voucher) => ({
          ...voucher,
          startDate: new Date(voucher.startDate),
          endDate: new Date(voucher.endDate)
        }));

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
        severity: 'warn',
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
    if (!voucher.nameVoucher || voucher.nameVoucher.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Lỗi',
        detail: 'Tên voucher không hợp lệ, không thể xóa.'
      });
      return;
    }

    if (!voucher.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Bạn chưa cập nhật voucher vào hệ thống. Vui lòng cập nhật trước khi xóa.'
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
        this._productService.deleteVoucher(voucher.nameVoucher).subscribe((res: any) => {

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
    this.vouchers.push({
      nameVoucher: '',
      percent: 0,
      startDate: new Date(),
      endDate: new Date(),
      createDate: new Date(),
      createBy: '85CC6F37-2B80-40C8-A9A8-71C1E7B653A0',
      modifyBy: '85CC6F37-2B80-40C8-A9A8-71C1E7B653A0'
    });
  }

  formatDate(date: any) {
    if (!date) return null;
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  }

  addOrUpdateVoucher() {
    const invalidVoucher = this.vouchers.filter((v: any) =>
      !v.nameVoucher || v.nameVoucher.trim() === "" ||
      !v.startDate || !v.endDate
    );
    if (invalidVoucher.length > 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Cảnh báo",
        detail: "Vui lòng điền đủ thông tin voucher"
      });
      return;
    }

    for (let v of this.vouchers) {
      if (new Date(v.startDate) > new Date(v.endDate)) {
        this.messageService.add({
          severity: "warn",
          summary: "Lỗi",
          detail: `Ngày kết thúc không được nhỏ hơn ngày bắt đầu!`
        });
        return;
      }
    }
    const formattedVouchers = this.vouchers.map((v: any) => ({
      ...v,
      startDate: this.formatDate(v.startDate),
      endDate: this.formatDate(v.endDate),
      createDate: this.formatDate(v.createDate)
    }));

    this._productService.addOrUpdateVoucher(formattedVouchers).subscribe((res: any) => {
      if (res && res.isSuccess == true) {
        console.log(res);
        this.getProductSelections();
        this.messageService.add({ severity: "success", summary: "Success", detail: res.data });
      } else {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Lỗi!" });
      }
    });
  }

  isExpired(endDate: any): boolean {
    if (!endDate) return false;
    const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại (yyyy-MM-dd)
    const voucherEndDate = new Date(endDate).toISOString().split("T")[0]; // Lấy ngày của voucher

    return voucherEndDate <= today; // Nếu ngày kết thúc <= hôm nay => Hết hạn
  }


}
