import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { MatStepperModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatButtonToggleModule, MatIconModule, MatAutocompleteModule, MatCardModule, MatDividerModule, MatExpansionModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PayOrderComponent } from './pay-order/pay-order.component';

@NgModule({
  declarations: [SaleOrderComponent, PayOrderComponent],
  imports: [
    CommonModule,
    MatStepperModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCardModule,
    HttpClientModule,
    DragDropModule,
    MatDividerModule,
    MatExpansionModule    
  ]
})
export class SalesModule { }
