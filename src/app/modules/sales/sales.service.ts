import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { SaleOrder } from '../../models/sale-order.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  serviceProtocol = 'http://';
  serviceHost = 'localhost:3000';
  contextPath = '/api';

  getHeader(){
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return headers;
  }
  

  constructor(private http: HttpClient) { }

  urlService(path: String){
    return this.serviceProtocol + this.serviceHost + this.contextPath + path;
  }
  
  getAllTables(): Observable<any> {
    return this.http.get<any>(this.urlService('/table'), { headers: this.getHeader()} );
  }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.urlService('/product'), { headers: this.getHeader()});
  }

  postSaleOrder(saleOrder: SaleOrder ): Observable<any> {
    return this.http.post<any>(this.urlService('/sales'), saleOrder, {headers: this.getHeader()} );
  }

  getPendingOrder(): Observable<any> {
    return this.http.get<any>(this.urlService('/sales'), { headers: this.getHeader()} );
  }


}
