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
    this.getPendingOrder();
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

  getAllTables(){    
    this.salesService.getAllTables().subscribe( data => {       
      this.tables = data ;
      //console.log(JSON.stringify(this.tables));      
    });
  }

  getPendingOrder(){    
    this.salesService.getPendingOrder().subscribe( data => {       
      let saleOrder: SaleOrder[] = [];    
      let auxSaleOrders: SaleOrder[];
      let auxSaleOrder: SaleOrder;

      // recorremos el array
      data.forEach((object) => {
        // obtenemos la venta si ya esta en el array
        auxSaleOrders = saleOrder.filter((formula) => formula.sale_id === object.sale_id);

        auxSaleOrder = auxSaleOrders.length === 0 ? undefined : auxSaleOrders[0];
      // si no existe creamos el array
        if (!auxSaleOrder) {
          auxSaleOrder = new SaleOrder(object.sale_id, object.table_name, object.status, object.sale_date, object.total_sale, object.tip);
          saleOrder.push(auxSaleOrder);
        }

        // si corresponde a la misma venta agregamos el detalle
        if (auxSaleOrder.saleOrderDetail.filter((detail) => detail.sale_id === object.sale_id)) {
          auxSaleOrder.addSaleOrderDetail(new SaleOrderDetail(object.sale_detail_id, object.sale_id, object.product_name, object.price, object.quantity));
        }

      });
      this.saleOrderPending = saleOrder;    
      //console.log('getAllProducts: '+JSON.stringify(this.saleOrderPending));   
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
    this.selectedTable = table;
  }

  sendSaleOrder(){
    let saleOrder = new SaleOrder();
    let saleOrderDetailList: SaleOrderDetail[] = [];
    
    saleOrder.sale_id = 0;
    saleOrder.table_name = this.selectedTable.table_name;
    saleOrder.status = 'PENDING'
    saleOrder.total_sale = 50000;
    saleOrder.tip = 5000;

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
