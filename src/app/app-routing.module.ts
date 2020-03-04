import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaleOrderComponent } from './modules/sales/sale-order/sale-order.component';
import { PayOrderComponent } from './modules/sales/pay-order/pay-order.component';


const routes: Routes = [
  {
    path: 'order',
    component: SaleOrderComponent
  },
  {
    path: 'pay',
    component: PayOrderComponent
  },
  {
    path: '**',
    component: SaleOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
