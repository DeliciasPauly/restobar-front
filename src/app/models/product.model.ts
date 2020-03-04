
export class Product {

  public product_name: string;
  public price: number;
  

  constructor(product_name?: string, price?: number) {

      this.product_name = product_name;
      this.price = price;
  }

}
