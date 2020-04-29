import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesService } from '../sales.service';
import { SaleOrder } from '../../../models/sale-order.model';
import { SaleOrderDetail } from '../../../models/sale-order-detail.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PayOrderDialogComponent } from '../pay-order-dialog/pay-order-dialog.component';


declare var require: any;
const swal2 = require('sweetalert2');

@Component({
  selector: 'app-pay-order',
  templateUrl: './pay-order.component.html',
  styleUrls: ['./pay-order.component.css']
})
export class PayOrderComponent implements OnInit {
  
  panelOpenState = false;  
  saleOrderPending: SaleOrder[] = [];
  payTip = false;

  constructor(private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog, private salesService: SalesService) { }

  ngOnInit() {
    this.getPendingOrder();
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
          auxSaleOrder.total_sale = auxSaleOrder.total_sale + object.price;
          auxSaleOrder.addSaleOrderDetail(new SaleOrderDetail(object.sale_detail_id, object.sale_id, object.product_name, object.price, object.quantity));
        }

      });
      this.saleOrderPending = saleOrder;    
      console.log('saleOrderPending: '+JSON.stringify(this.saleOrderPending));   
    });
  }

  getPayTip(order) {
    order.tip = 0;
    if(this.payTip) {
      order.tip =  order.total_sale * 0.10;
    }
  }

  openDialog(order): void {
    const dialogRef = this.dialog.open(PayOrderDialogComponent, {
      width: '300px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(rut => {
      console.log('The dialog was closed '+rut);
      this.sendSaleOrder(order, rut);
    });
  }
  
  sendSaleOrder(order, rut){
    let saleOrder = new SaleOrder();  
    saleOrder = order;  
    saleOrder.rut = rut;
    this.salesService.putSaleOrder(saleOrder).subscribe( response => {
      
      console.log(JSON.stringify(response));    
      if(response.code === 200){      
        swal2.fire({
          title: 'Pedido Pagado',
          text: '',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          console.log(result);
          if (result.value) {
            this.router.navigate(['/pay']);
          }      
        });
      }else{     
        swal2.fire({
          title: '<p>Hubo un problema <br> vuelva a enviar el pedido1</p>',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        });        
      }

    }, (error) => {
      console.log(error);         
      swal2.fire({
        title: '<p>Hubo un problema <br> vuelva a enviar el pedido2</p>',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });        

    });

  }

}
