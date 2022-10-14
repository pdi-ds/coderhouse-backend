import { Request, Response, Router } from "express";
import Carts, { Cart, CartProduct } from "../../services/Carts/Carts";

const storage: Carts = new Carts();
const routes = Router();

routes
  .post("/", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage.create().then((cart: Cart) => {
      response.json({ cart });
    });
  })
  .get("/:id", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .get(Number(request.params.id))
      .then((cart: Cart | boolean) => {
        cart !== false
          ? response.json({ cart })
          : response.json({
              error: "Cart not found",
            });
      });
  })
  .get("/:id/productos", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .get(Number(request.params.id))
      .then((cart: Cart | boolean) => {
        cart !== false
          ? response.json({
              products: (cart as Cart).products,
            })
          : response.json({
              error: "Cart not found",
            });
      });
  })
  .post("/:id/productos", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    const products: Array<CartProduct> = request.body.products.map(
      (product: { id: string; amount?: string }) => ({
        id: Number(product.id),
        amount: Number(product.amount),
      })
    );
    await storage
      .addToCart(Number(request.params.id), products)
      .then((cart: Cart | boolean) => {
        cart !== false
          ? response.json({ cart })
          : response.json({
              error: "Cart not found",
            });
      });
  })
  .delete(
    "/:id/productos/:product_id",
    async (request: Request, response: Response) => {
      response.setHeader("Content-Type", "application/json; charset=UTF-8");
      await storage
        .removeFromCart(
          Number(request.params.id),
          Number(request.params.product_id)
        )
        .then((cart: Cart | boolean) => {
          cart !== false
            ? response.json({ cart })
            : response.json({ error: "Cart not found" });
        });
    }
  )
  .delete("/:id", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage.delete(Number(request.params.id)).then((cart: boolean) => {
      cart !== false
        ? response.json({
            message: "Cart deleted successfully",
          })
        : response.json({
            error: "Cart not found",
          });
    });
  });

export default routes;
