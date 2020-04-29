import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { SalesService } from '../sales.service';
import { Table } from '../../../models/table.model';
import { Product } from '../../../models/product.model';
import { SaleOrder } from '../../../models/sale-order.model';
import { SaleOrderDetail } from '../../../models/sale-order-detail.model';

declare var require: any;
const swal2 = require('sweetalert2');

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.css']
})
export class SaleOrderComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  productCtrl = new FormControl();
  filteredProduct: Observable<Product[]>;

  tables: Table[] = [];
  products: Product[] = [] ;
  saleOrderList: Product[] = [];
  saleOrderPending: SaleOrder[] = [];

  selectedTable= new Table();

  constructor(private formBuilder: FormBuilder, private router: Router, private salesService: SalesService) {

    this.filteredProduct = this.productCtrl.valueChanges
      .pipe(
        startWith(''),
        map(product => product ? this._filterProduct(product) : this.products.slice())
      );

  }

  private _filterProduct(value: string): Product[] {
    const filterValue = value.toLowerCase();

    return this.products.filter(product => product.product_name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    
    this.firstFormGroup = this.formBuilder.group({
      nmb: ['', Validators.required],
    });

    this.getAllTables();
    this.getAllProducts();
  }

  getAllTables(){    
    this.salesService.getAllTables().subscribe( data => {       
      this.tables = data ;
      //console.log(JSON.stringify(this.tables));      
    });
  }

  getAllProducts(){    
    this.salesService.getAllProducts().subscribe( data => {
      this.products = data;
      //console.log('getAllProducts: '+JSON.stringify(this.products));      
    });
  }

  addOrder(table){
    //console.log('addOrder: '+JSON.stringify(table)); 
    this.selectedTable.table_name = table;
    this.saleOrderList = [];
    this.getPendingOrderTable(table);
  }

  getPendingOrderTable(table: String){    
    this.salesService.getPendingOrderTable(table).subscribe( data => {         
      // recorremos el array detalle de orden
      data.forEach((object) => {        
        let product = new Product(object.product_name, object.price);
        this.addProduct(product);
      });  
    });
  }
  
  addProduct(product){
    //console.log('product: ', product );
    this.saleOrderList.push(product);
    this.productCtrl.setValue('') ;
  }

  deleteProduct(product){
    //console.log('product: ', product );
    this.saleOrderList = this.saleOrderList.filter(x => x != product);
  }

  sendSaleOrder(){
    let saleOrder = new SaleOrder();
    let saleOrderDetailList: SaleOrderDetail[] = [];
    
    saleOrder.sale_id = 0;
    saleOrder.table_name = this.selectedTable.table_name;
    saleOrder.status='PENDING';
    saleOrder.total_sale=0;
    
    this.saleOrderList.forEach(data => {
      let saleOrderDetail = new SaleOrderDetail();
      saleOrderDetail.sale_detail_id = 0;
      saleOrderDetail.sale_id = 0;
      saleOrderDetail.product_name = data.product_name;
      saleOrderDetail.price = data.price;
      saleOrderDetail.quantity = 1;
      saleOrderDetailList.push(saleOrderDetail);
    });
    
    saleOrder.saleOrderDetail = saleOrderDetailList;

    //console.log(JSON.stringify(saleOrder));
    this.salesService.postSaleOrder(saleOrder).subscribe( response => {
      
      console.log(JSON.stringify(response));    
      if(response.code === 200){      
        swal2.fire({
          title: 'Pedido de '+ saleOrder.table_name + ' enviado',
          text: 'Puede volver a verlo haciendole click a la mesa',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          console.log(result);
          if (result.value) {
            this.router.navigate(['/order']);
          }      
        });
      }else{     
        swal2.fire({
          title: '<p>Hubo un problema <br> vuelva a enviar el pedido</p>',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });        
      }

    }, (error) => {
      console.log(error);         
      swal2.fire({
        title: '<p>Hubo un problema <br> vuelva a enviar el pedido</p>',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });        

    });

  }


  //drag & drop

  trash = [];
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,event.container.data,event.previousIndex,event.currentIndex);
      this.trash = [];
    }

  }

}
