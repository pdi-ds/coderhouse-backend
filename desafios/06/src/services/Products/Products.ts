import { PathLike } from "fs";

type Product = {
  [key: string]: number | String | PathLike | undefined;
  id?: number;
  title?: String;
  price?: number;
  thumbnail?: PathLike;
};
type ValidationResult = {
  valid?: Array<Validation>;
  errors?: Array<Validation>;
};
type Validation = {
  field: String;
  message?: String;
  valid: boolean;
};
class Products {
  private maxId: number = 0;
  private products: Array<Product>;
  constructor(products: Array<Product> = []) {
    this.products = products;
  }
  create(product: Product): Product | ValidationResult {
    const validation: ValidationResult = this.validateProduct(product);
    if (
      typeof validation.errors !== "undefined" &&
      validation.errors.length > 0
    )
      return validation;
    const id: number = ++this.maxId;
    const record: Product = { id, ...product };
    this.products.push(record);
    return record;
  }
  update(id: number, product: Product): Product | ValidationResult | boolean {
    const index: number = this.getIndexById(id);
    if (index < 0) return false;
    const validation: ValidationResult = this.validateProduct(product);
    if (!validation.valid || validation.valid.length === 0) return validation;
    const update: Product = {};
    validation.valid.map((valid: Validation) => {
      update[String(valid.field)] = product[String(valid.field)];
    });
    this.products[index] = { ...this.products[index], ...update };
    return this.products[index];
  }
  getById(id: number): Product | boolean {
    return (
      this.products.filter((product: Product) => product.id === id)[0] || false
    );
  }
  getIndexById(id: number): number {
    return this.products.findIndex((product: Product) => product.id === id);
  }
  getAll(): Array<Product> {
    return this.products;
  }
  deleteById(id: number): boolean {
    const index: number = this.getIndexById(id);
    if (index < 0) return false;
    this.products.splice(index, 1);
    return true;
  }
  validateProduct(product: Product): ValidationResult {
    const results: Array<Validation> = [
      {
        field: "title",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <title> field is required.",
      },
      {
        field: "price",
        validator: (value: any): boolean => {
          return !isNaN(parseInt(value));
        },
        message: "The <price> field is required.",
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

export { Product, Validation, ValidationResult };
export default Products;
