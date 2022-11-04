import { Container } from "../../data-access/data-access";
import Products, { Product } from "../Products/Products";
import { ConnectionConfig } from "../../config/ConnectionConfig";
import firebase from "firebase/compat";
import Promotion = firebase.analytics.Promotion;

type Cart = {
  [key: string]: number | Array<Product> | undefined;
  id?: any;
  timestamp?: number | undefined;
  products: Array<CartProduct>;
};

type CartProduct = Product & {
  amount: number;
};

class Carts extends Container {
  private readonly products: Products;
  readonly aggregationFields: object = {
    $project: {
      _id: 0,
      id: "$_id",
      timestamp: 1,
      products: 1,
    },
  };

  constructor(config: ConnectionConfig) {
    super(config, "carts");
    this.products = new Products(config);
  }

  async create(): Promise<Cart | boolean> {
    const record: Cart = { timestamp: Date.now(), products: [] };
    const result = await this.insert(record);
    return result !== false ? { id: result, ...record } : false;
  }

  async addToCart(
    id: any,
    products: Array<CartProduct>
  ): Promise<Cart | null | boolean> {
    const record: object | null = await this.get(id);
    if (record === null) return null;
    let filteredProducts: Array<CartProduct> = [];
    let index = 0;
    while (index < products.length) {
      const product = await this.products
        .get(products[index].id)
        .then((result) => result);
      if (product !== null) {
        const productIndex = (record as Cart).products.findIndex(
          ({ id }) => String(id) === String((product as Product).id)
        );
        if (productIndex >= 0) {
          (record as Cart).products[productIndex].amount +=
            products[index].amount;
        } else {
          filteredProducts.push({
            ...product,
            amount: products[index]?.amount || 1,
          });
        }
      }
      index = index + 1;
    }
    if (filteredProducts.length > 0) {
      filteredProducts = ([] as Array<CartProduct>).concat(
        (record as Cart).products,
        filteredProducts
      );
      filteredProducts = filteredProducts.filter(
        (value, index) => filteredProducts.indexOf(value) === index
      );
    }

    const cart: Cart = {
      products:
        filteredProducts.length > 0
          ? filteredProducts
          : (record as Cart).products,
    };
    const result = await this.update(id, { ...cart });
    return result !== false ? cart : false;
  }

  async removeFromCart(
    id: any,
    productId: any
  ): Promise<Cart | boolean | null> {
    const record: object | null = await this.get(id);
    if (record === null) return null;
    const productIndex = (record as Cart).products.findIndex(
      (product: CartProduct) => String(product.id) === String(productId)
    );
    if (productIndex >= 0) {
      (record as Cart).products.splice(productIndex, 1);
      const cart: Cart = { products: (record as Cart).products };
      await this.update(id, { ...cart });
      return cart;
    }
    return record as Cart;
  }

  async insert(data: Object): Promise<any | boolean> {
    return await super.insert(this.encode(data));
  }

  async update(id: any, data: object): Promise<boolean> {
    return await super.update(id, this.encode(data));
  }

  encode(data: object): object {
    switch (process.env.DB_ENGINE) {
      case "mysql":
      case "sqlite3":
        (data as { products: Array<any> | String }).products = JSON.stringify(
          (data as Cart).products
        );
        break;
    }
    return data;
  }

  async get(id: any): Promise<object | null> {
    return await super.get(id).then((response: object) => {
      if (response !== null)
        (response as { products: Array<any> | String }).products = JSON.parse(
          (response as { products: string }).products
        );
      return response;
    });
  }

  async remove(id: any): Promise<boolean | null> {
    const record: object | null = await this.get(id);
    if (record === null) return null;
    return await super.delete(id);
  }
}

export { Cart, CartProduct };
export default Carts;
