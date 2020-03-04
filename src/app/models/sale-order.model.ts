import { SaleOrderDetail } from './sale-order-detail.model';

export class SaleOrder {

  public sale_id: number;
  public table_name: string;
  public status: string;
  public sale_date: string;
  public total_sale: number;
  public tip: number;
  public saleOrderDetail: SaleOrderDetail[] = [];
  

  constructor(sale_id?: number, table_name?: string, status?: string, sale_date?: string, total_sale?: number, tip?: number) {

      this.sale_id = sale_id;
      this.table_name = table_name;
      this.status = status;
      this.sale_date = sale_date;
      this.total_sale = total_sale;
      this.tip = tip;
  }

  addSaleOrderDetail(saleOrderDetail) {
    this.saleOrderDetail.push(saleOrderDetail);
  }

}
