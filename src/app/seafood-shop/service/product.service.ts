import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  serviceUri: any;
  constructor(private http: HttpClient) {
    this.serviceUri =`${environment.apiUrl}/Product`;
  }

  addProduct(model: any) {
    var apiUrl = `${this.serviceUri}/Add`;
    return this.http.post(apiUrl, model)
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );;
  }

  getProductSelections() {
    var apiUrl = `${this.serviceUri}/Get-product-selections`;
    return this.http.get(apiUrl)
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );
  }

  addOrUpdateCategory(model: any) {
    var apiUrl = `${this.serviceUri}/Add-or-update-category`;
    return this.http.post(apiUrl, model)
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );
  }

  deleteCategory(categoryName: string) {
    const apiUrl = `${this.serviceUri}/Delete-category`;
    const params = new HttpParams().set('categoryName', categoryName);

    return this.http.delete(apiUrl, { params })
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );
  }

  addOrUpdateVoucher(model: any) {
    var apiUrl = `${this.serviceUri}/Add-or-update-voucher`;
    return this.http.post(apiUrl, model)
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );
  }

  deleteVoucher(voucherName: string) {
    const apiUrl = `${this.serviceUri}/Delete-voucher`;
    const params = new HttpParams().set('voucherName', voucherName);

    return this.http.delete(apiUrl, { params })
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );
  }

}
