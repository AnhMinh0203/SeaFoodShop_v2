import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
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
}
