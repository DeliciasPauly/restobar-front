
export class SaleOrderDetail {

  public sale_detail_id: number;
  public sale_id: number;
  public product_name: string;
  public price: number;
  public quantity: number;
  

  constructor(sale_detail_id?: number, sale_id?: number, product_name?: string, price?: number, quantity?: number) {

      this.sale_detail_id = sale_detail_id;
      this.sale_id = sale_id;
      this.product_name = product_name;
      this.price = price;
      this.quantity = quantity;
  }

}
