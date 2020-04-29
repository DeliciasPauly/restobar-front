import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { SaleOrder } from '../../models/sale-order.model';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  getHeader(){
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return headers;
  }
  
  constructor(private http: HttpClient) { }

  urlService(path: String){    
    console.log('REST:'+ environment.endpoints.host );
    return  environment.endpoints.host + environment.endpoints.port + environment.endpoints.path + path;    
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

  putSaleOrder(saleOrder: SaleOrder ): Observable<any> {
    return this.http.put<any>(this.urlService('/sales'), saleOrder, {headers: this.getHeader()} );
  }

  getPendingOrderTable(table: String): Observable<any> {
    if("" != table.trim()){
      return this.http.get<any>(this.urlService('/sales/'+table), { headers: this.getHeader()} );
    }
  }

  getPendingOrder(): Observable<any> {
    return this.http.get<any>(this.urlService('/sales'), { headers: this.getHeader()} );
  }


}
