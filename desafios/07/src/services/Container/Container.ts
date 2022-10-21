import knex, { Knex } from "knex";
import CreateTableBuilder = Knex.CreateTableBuilder;

class Container {
  readonly tableName: string;
  readonly connection;

  constructor(config: object, tableName: string) {
    this.tableName = tableName;
    this.connection = knex(config);
  }

  async createTable(
    create: (table: CreateTableBuilder) => void
  ): Promise<boolean> {
    return this.connection.schema
      .createTable(this.tableName, create)
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async store(records: Array<object>): Promise<boolean> {
    return await this.connection(this.tableName)
      .insert(records)
      .then(() => true)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  async getAll(): Promise<Array<object> | boolean> {
    return await this.connection
      .from(this.tableName)
      .select("*")
      .then((records: Array<any>) => records)
      .catch((err) => {
        console.log(err);
        return false;
      });
  }

  destroy(): void {
    this.connection.destroy();
  }
}

export default Container;
