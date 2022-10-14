import { Request, Response, Router } from "express";
import Products, {
  Product,
  ValidationResult,
  isValidationResult,
} from "../../services/Products/Products";
import { isAdmin } from "../Utils/Utils";

const storage: Products = new Products();
const routes = Router();

routes
  .get("/", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage.all().then((products: Array<Product>) => {
      response.send({ products });
    });
  })
  .get("/:id", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .get(Number(request.params.id))
      .then((product: Product | boolean) => {
        product !== false
          ? response.json({ product })
          : response.json({
              error: "Product not found",
            });
      });
  })
  .post("/", isAdmin, async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .create({
        name: request.body.name,
        description: request.body.description,
        sku: request.body.sku,
        price: Number(request.body.price),
        stock: Number(request.body.stock),
        thumbnail: request.body.thumbnail,
      })
      .then((result: ValidationResult | Product) => {
        isValidationResult(result) === true &&
        (result as ValidationResult).errors.length > 0
          ? response.json({
              error: "Check the entered fields",
              errors: result.errors,
            })
          : response.json(result);
      });
  })
  .put("/:id", isAdmin, async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .update(Number(request.params.id), {
        name: request.body?.name,
        description: request.body?.description,
        sku: request.body?.sku,
        price: Number(request.body?.price),
        stock: Number(request.body?.stock),
        thumbnail: request.body?.thumbnail,
      })
      .then((result: Product | ValidationResult | false) => {
        if (result === false) response.json({ error: "Product not found" });
        else
          isValidationResult(result) === true &&
          (result as ValidationResult).errors.length > 0
            ? response.json({
                error: "Check the entered fields",
                errors: result.errors,
              })
            : response.json({
                product: result,
              });
      });
  })
  .delete("/:id", isAdmin, async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage.delete(Number(request.params.id)).then((product: boolean) => {
      product !== false
        ? response.json({
            message: "Product removed successfully",
          })
        : response.json({
            error: "Product not found",
          });
    });
  });

export default routes;
