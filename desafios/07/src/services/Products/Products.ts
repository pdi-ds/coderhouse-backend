import { PathLike } from "fs";
import Container from "../Container/Container";
import { Knex } from "knex";
import CreateTableBuilder = Knex.CreateTableBuilder;

type Product = {
  [key: string]: number | String | PathLike | undefined;
  id?: number;
  name?: String;
  price?: number;
  thumbnail?: PathLike;
};

type Validation = {
  [key: string]: String | boolean | undefined;
  field: String;
  message?: String;
  valid: boolean;
};

type ValidationResult = {
  [key: string]: Array<Validation>;
  valid: Array<Validation>;
  errors: Array<Validation>;
};

function isValidationResult(test: Product | ValidationResult): boolean {
  return (test as ValidationResult).errors !== undefined;
}

class Products extends Container {
  private tableCreated: boolean = false;
  constructor(config: object) {
    super(config, "products");
  }

  async create(
    product: Product
  ): Promise<ValidationResult | Product | boolean> {
    await this.checkTable();
    const validation: ValidationResult = this.validateProduct(product);
    if (validation.errors.length > 0) return validation;
    const result = await this.store([{ ...product }]);
    return result === true ? product : false;
  }

  async getAll(): Promise<Array<any> | boolean> {
    await this.checkTable();
    return await super.getAll();
  }

  async checkTable(): Promise<boolean> {
    if (this.tableCreated === false) {
      const exists: boolean = await this.connection.schema.hasTable(
        this.tableName
      );
      if (exists === false) {
        await this.createTable((table: CreateTableBuilder): void => {
          table.increments("id");
          table.string("name", 255);
          table.float("price");
          table.text("thumbnail");
        })
          .then(() => {
            this.tableCreated = true;
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
      }
    }
    return true;
  }
  validateProduct(data: Product): ValidationResult {
    const results: Array<Validation> = [
      {
        field: "name",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <name> field is required.",
      },
      {
        field: "price",
        validator: (value: any): boolean => {
          return !isNaN(parseInt(value)) && Number(value) >= 0;
        },
        message: "The <price> field is required.",
      },
      {
        field: "thumbnail",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <thumbnail> field is required.",
      },
    ].map(
      ({
        field,
        validator,
        message,
      }: {
        field: string;
        validator: Function;
        message: string;
      }): Validation =>
        validator.call(null, data[field] || null) === false
          ? { field, message, valid: false }
          : { field, valid: true }
    );

    return {
      valid: results.filter(
        (validation: Validation) => validation.valid === true
      ),
      errors: results.filter(
        (validation: Validation) => validation.valid === false
      ),
    };
  }
}

export { Product, Validation, ValidationResult, isValidationResult };
export default Products;
