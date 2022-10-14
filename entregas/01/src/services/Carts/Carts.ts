import Container from "../Container/Container";
import config from "../../config/config";
import Products, { Product } from "../Products/Products";

type Cart = {
  [key: string]: number | Array<Product>;
  id: number;
  timestamp: number;
  products: Array<CartProduct>;
};

type CartProduct = Product & {
  amount: number;
};

class Carts extends Container {
  private maxId: number = 0;
  private carts: Array<Cart> = [];
  private loaded: boolean = false;

  constructor() {
    super(`${config.DATA_STORAGE}/carts.json`);
  }

  async create(): Promise<Cart> {
    await this.verifyLoaded();
    const id: number = ++this.maxId;
    const record: Cart = { id, timestamp: Date.now(), products: [] };
    this.carts.push(record);
    await this.save(this.carts);
    return record;
  }

  async addToCart(
    id: number,
    products: Array<CartProduct>
  ): Promise<Cart | boolean> {
    await this.verifyLoaded();
    const index: number = this.getIndex(id);
    if (index < 0) return false;
    const cart: Cart = this.carts[index];
    const storage = new Products();
    const availableProducts: Array<Product> = await storage
      .all()
      .then((products) => products);
    const ids: Array<number> = availableProducts.map((product: Product) =>
      Number(product.id)
    );

    products.forEach((product: CartProduct) => {
      const id: number = Number(product.id);
      const productIndex: number = storage.getIndex(Number(id));
      if (
        ids.indexOf(id) >= 0 &&
        Number(availableProducts[productIndex]?.stock) > 0
      ) {
        const index: number = cart.products.findIndex(
          (cartProduct: CartProduct) => cartProduct.id === product.id
        );
        const amount: number = Math.min(
          Number(availableProducts[productIndex].stock),
          index < 0
            ? product.amount
            : cart.products[index].amount + product.amount
        );
        index < 0
          ? cart.products.push({ ...availableProducts[productIndex], amount })
          : (cart.products[index].amount = amount);
      }
    });
    await this.save(this.carts);
    return cart;
  }

  async removeFromCart(id: number, productId: number): Promise<Cart | boolean> {
    await this.verifyLoaded();
    const index: number = this.getIndex(id);
    if (index < 0) return false;
    const cart: Cart = this.carts[index];
    const productIndex = cart.products.findIndex(
      (product: CartProduct) => product.id === productId
    );
    if (productIndex >= 0) {
      cart.products.splice(productIndex, 1);
      await this.save(this.carts);
    }
    return cart;
  }

  async get(id: number): Promise<Cart | boolean> {
    await this.verifyLoaded();
    return this.carts.filter((cart: Cart) => cart.id === id)[0] || false;
  }

  private getIndex(id: number): number {
    return this.carts.findIndex((cart: Cart) => Number(cart.id) === id);
  }

  async delete(id: number): Promise<boolean> {
    await this.verifyLoaded();
    const index: number = this.getIndex(id);
    if (index < 0) return false;
    this.carts.splice(index, 1);
    await this.save(this.carts);
    return true;
  }

  private async verifyLoaded() {
    if (this.loaded === false) {
      await this.getAll().then((carts) => {
        this.carts = carts;
        this.maxId = this.carts[this.carts.length - 1]?.id || 0;
      });
      this.loaded = true;
    }
  }
}

export { Cart, CartProduct };
export default Carts;
