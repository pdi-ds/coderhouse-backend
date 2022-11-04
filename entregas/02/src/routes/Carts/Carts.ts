import { Request, Response, Router } from "express";
import Carts, { Cart, CartProduct } from "../../services/Carts/Carts";
import { config } from "../../data-access/data-access";

const storage: Carts = new Carts(config);
const routes = Router();

routes
  .post("/", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .create()
      .then((result: Cart | boolean) => {
        result !== false
          ? response.json({
              message: "Cart created successfully",
              cart: result,
            })
          : response.json({
              error: "An error occurred while trying to enter the record",
            });
      })
      .catch((err) => {
        response.json({
          error: "An error occurred while trying to enter the cart",
        });
      });
  })
  .get("/:id", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .get(request.params.id)
      .then((result: object | null) => {
        result !== null
          ? response.json({ cart: result })
          : response.json({
              error: "Cart not found",
            });
      })
      .catch((err) => {
        response.json({
          error: "An error occurred while trying to load the cart",
        });
      });
  })
  .get("/:id/productos", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .get(request.params.id)
      .then((result: object | null) => {
        result !== null
          ? response.json({
              products: (result as Cart).products,
            })
          : response.json({
              error: "Cart not found",
            });
      })
      .catch((err) => {
        response.json({
          error:
            "An error occurred while trying to load the products from the cart",
        });
      });
  })
  .post("/:id/productos", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    const products: Array<CartProduct> = request.body.products.map(
      (product: { id: string; amount?: string }) => ({
        id: product.id,
        amount: Number(product.amount),
      })
    );
    await storage
      .addToCart(request.params.id, products)
      .then((result: Cart | null | boolean) => {
        if (result !== false) {
          if (result === null) {
            response.json({
              error: "Cart not found",
            });
          } else {
            response.json({
              message: "Products added to cart successfully",
              cart: result,
            });
          }
        } else {
          response.json({
            error: "An error occurred while trying to edit the registry",
          });
        }
      })
      .catch((err) => {
        response.json({
          error: "Ocurrió un error al intentar agregar el producto el carro",
        });
      });
  })
  .delete(
    "/:id/productos/:product_id",
    async (request: Request, response: Response) => {
      response.setHeader("Content-Type", "application/json; charset=UTF-8");
      await storage
        .removeFromCart(request.params.id, request.params.product_id)
        .then((result: Cart | null | boolean) => {
          if (result !== false) {
            if (result === null) {
              response.json({
                error: "Cart not found",
              });
            } else {
              response.json({
                message: "Product removed successfully",
                cart: result,
              });
            }
          } else {
            response.json({
              error: "An error occurred while trying to edit the registry",
            });
          }
        })
        .catch((err) => {
          response.json({
            error:
              "An error occurred while trying to remove the product from the cart",
          });
        });
    }
  )
  .delete("/:id", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .remove(request.params.id)
      .then((result: boolean | null) => {
        if (result !== false) {
          if (result === null) {
            response.json({
              error: "Cart not found",
            });
          } else {
            response.json({
              message: "Cart deleted successfully",
            });
          }
        } else {
          response.json({
            error: "An error occurred while trying to edit the registry",
          });
        }
      })
      .catch((err) => {
        response.json({
          error: "An error occurred while trying to delete the cart",
        });
      });
  });

export default routes;
