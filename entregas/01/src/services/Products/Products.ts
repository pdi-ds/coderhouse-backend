import { PathLike } from "fs";
import Container from "../Container/Container";
import config from "../../config/config";

type Product = {
  [key: string]: number | String | PathLike | undefined;
  id?: number;
  timestamp?: number;
  name?: String;
  description?: String;
  sku?: String;
  price?: number;
  stock?: number;
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
  private maxId: number = 0;
  private products: Array<Product> = [];
  private loaded: boolean = false;
  constructor() {
    super(`${config.DATA_STORAGE}/products.json`);
  }

  async create(product: Product): Promise<ValidationResult | Product> {
    await this.verifyLoaded();
    const validation: ValidationResult = this.validateProduct(product);
    if (validation.errors.length > 0) return validation;
    const id: number = ++this.maxId;
    const record: Product = { id, timestamp: Date.now(), ...product };
    this.products.push(record);
    await this.save(this.products);
    return record;
  }

  async update(
    id: number,
    product: Product
  ): Promise<Product | ValidationResult | false> {
    await this.verifyLoaded();
    const index: number = this.getIndex(id);
    if (index < 0) return false;
    const validation: ValidationResult = this.validateProduct(product);
    if (validation.valid.length === 0) return validation;
    const update: Product = {};
    validation.valid.map((valid: Validation) => {
      update[String(valid.field)] = product[String(valid.field)];
    });
    this.products[index] = { ...this.products[index], ...update };
    await this.save(this.products);
    return this.products[index];
  }

  async get(id: number): Promise<Product | boolean> {
    await this.verifyLoaded();
    return (
      this.products.filter((product: Product) => product.id === id)[0] || false
    );
  }

  getIndex(id: number): number {
    return this.products.findIndex(
      (product: Product) => Number(product.id) === id
    );
  }

  async all(): Promise<Array<Product>> {
    await this.verifyLoaded();
    return this.products;
  }

  async delete(id: number): Promise<boolean> {
    await this.verifyLoaded();
    const index: number = this.getIndex(id);
    if (index < 0) return false;
    this.products.splice(index, 1);
    await this.save(this.products);
    return true;
  }

  private async verifyLoaded() {
    if (this.loaded === false) {
      await this.getAll().then((products) => {
        this.products = products;
        this.maxId = this.products[this.products.length - 1]?.id || 0;
      });
      this.loaded = true;
    }
  }

  validateProduct(product: Product): ValidationResult {
    const results: Array<Validation> = [
      {
        field: "name",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The field <name> is required",
      },
      {
        field: "description",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <description> field is required",
      },
      {
        field: "sku",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <sku> field is required",
      },
      {
        field: "price",
        validator: (value: any): boolean => {
          return !isNaN(parseInt(value)) && Number(value) >= 0;
        },
        message: "The <price> field is required",
      },
      {
        field: "stock",
        validator: (value: any): boolean => {
          return !isNaN(parseInt(value)) && Number(value) >= 0;
        },
        message: "The <stock> field is required",
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
        validator.call(null, product[field] || null) === false
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
