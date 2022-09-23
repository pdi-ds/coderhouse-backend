import { Request, Response, Router } from "express";
import Products, {
  Product,
  Validation,
  ValidationResult,
} from "../../services/Products/Products";

const storage: Products = new Products();
const routes = Router();
routes
  .get("/", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    const products: Array<Product> = storage.getAll();
    response.send(products);
  })
  .get("/:id", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    const product: Product | boolean = storage.getById(
      Number(request.params.id)
    );
    product !== false
      ? response.json(product)
      : response.json({ error: "Product not found" });
  })
  .post("/", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    const result: Product | ValidationResult = storage.create({
      title: request.body.title,
      price: Number(request.body.price),
      thumbnail: request.body.thumbnail,
    });
    result.hasOwnProperty("errors") === true
      ? response.json({
          error: "Check the entered fields",
          errors: result["errors"],
        })
      : response.json(result);
  })
  .put("/:id", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    const result: Product | ValidationResult | boolean = storage.update(
      Number(request.params.id),
      {
        title: request.body?.title,
        price: Number(request.body?.price),
        thumbnail: request.body?.thumbnail,
      }
    );
    if (result === false) response.json({ error: "Product not found" });
    result.hasOwnProperty("errors") === true
      ? response.json({
          error: "Check the entered fields",
          errors: result["errors"],
        })
      : response.json(result);
  })
  .delete("/:id", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    const product: Product | boolean = storage.deleteById(
      Number(request.params.id)
    );
    product !== false
      ? response.json({ message: "Product removed successfully" })
      : response.json({ error: "Check the entered fields" });
  });

export default routes;
