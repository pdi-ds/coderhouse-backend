import { Request, Response, Router } from "express";
import Products, {
  Product,
  ValidationResult,
} from "../../services/Products/Products";

const storage: Products = new Products();
const routes = Router();

routes
  .get("/", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "text/html; charset=UTF-8");
    const query: Object =
      (request.query.hasOwnProperty("result") === true &&
        JSON.parse(<string>request.query.result)) ||
      {};
    response.render("form", query);
  })
  .get("/productos", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "text/html; charset=UTF-8");
    const products: Array<Product> = storage.getAll();
    response.render("products", { products });
  })
  .post("/productos", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "text/html; charset=UTF-8");
    const result: Product | ValidationResult = storage.create({
      title: request.body.title,
      price: Number(request.body.price),
      thumbnail: request.body.thumbnail,
    });
    const query = JSON.stringify(
      result.hasOwnProperty("errors") === true
        ? {
            error: "Check the entered fields",
            errors: result["errors"],
            values: request.body,
          }
        : { success: true }
    );
    response.redirect(`/?result=${query}`);
  });

export default routes;
