import { PathLike } from "fs";
import { Container } from "../../data-access/data-access";
import { ConnectionConfig } from "../../config/ConnectionConfig";

type Product = {
  [key: string]: number | String | PathLike | undefined;
  id?: number | String;
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

function isValidationResult(
  test: Product | ValidationResult | boolean
): boolean {
  return test !== false && (test as ValidationResult).errors !== undefined;
}

class Products extends Container {
  readonly aggregationFields: object = {
    $project: {
      _id: 0,
      id: "$_id",
      name: 1,
      price: 1,
      thumbnail: 1,
    },
  };
  constructor(config: ConnectionConfig) {
    super(config, "products");
  }

  async create(
    product: Product
  ): Promise<ValidationResult | Product | boolean> {
    const validation: ValidationResult = this.validateProduct(product);
    if (validation.errors.length > 0) return validation;
    const result = await this.insert(product);
    return result !== false ? { id: result, ...product } : false;
  }

  async edit(
    id: any,
    product: Product
  ): Promise<Product | ValidationResult | boolean | null> {
    const record: object | null = await this.get(id);
    if (record === null) return null;
    const validation: ValidationResult = this.validateProduct(product);
    if (validation.valid.length === 0) return validation;
    const update: Product = {};
    validation.valid.map((valid: Validation) => {
      update[String(valid.field)] = product[String(valid.field)];
    });
    const result = await super.update(id, { ...update });
    return result === true ? product : false;
  }

  async remove(id: any): Promise<boolean | null> {
    const record: object | null = await this.get(id);
    if (record === null) return null;
    return await super.delete(id);
  }

  async get(id: any): Promise<object | null> {
    return await super.get(id);
  }

  async getAll(): Promise<Array<object>> {
    return await super.getAll();
  }

  validateProduct(data: Product): ValidationResult {
    const results: Array<Validation> = [
      {
        field: "name",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <name> field is required",
      },
      {
        field: "price",
        validator: (value: any): boolean => {
          return !isNaN(parseInt(value)) && Number(value) >= 0;
        },
        message: "The <price> field is required and must be a numeric value",
      },
      {
        field: "thumbnail",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <thumbnail> field is required",
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
