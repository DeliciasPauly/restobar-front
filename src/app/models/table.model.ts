
export class Table {

  public table_name: string;
  public active: string;
  

  constructor(table_name?: string, active?: string) {

      this.table_name = table_name;
      this.active = active;
  }

}
