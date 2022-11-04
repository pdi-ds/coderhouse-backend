import { Request, Response, Router } from "express";
import Products, {
  Product,
  ValidationResult,
  isValidationResult,
} from "../../services/Products/Products";
import { isAdmin } from "../Utils/Utils";
import { config } from "../../data-access/data-access";

const storage: Products = new Products(config);
const routes = Router();

routes
  .get("/", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .getAll()
      .then((products: Array<object>) => {
        response.send({ products });
      })
      .catch((err) => {
        response.json({
          error: "An error occurred while trying to load the products",
        });
      });
  })
  .get("/:id", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .get(request.params.id)
      .then((result: object | null) => {
        result !== null
          ? response.json({ product: result })
          : response.json({
              error: "Product not found",
            });
      })
      .catch((err) => {
        response.json({
          error: "An error occurred while trying to load the product",
        });
      });
  })
  .post("/", isAdmin, async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .create({
        name: request.body.name,
        price: Number(request.body.price),
        thumbnail: request.body.thumbnail,
      })
      .then((result: ValidationResult | Product | boolean) => {
        if (result !== false) {
          isValidationResult(result) === true &&
          (result as ValidationResult).errors.length > 0
            ? response.json({
                error: "Check the entered fields",
                errors: (result as ValidationResult).errors,
              })
            : response.json({
                message: "Product created successfully",
                product: result,
              });
        } else {
          response.json({
            error: "An error occurred while trying to enter the record",
          });
        }
      })
      .catch((err) => {
        response.json({
          error: "An error occurred while trying to enter the product",
        });
      });
  })
  .put("/:id", isAdmin, async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .edit(request.params.id, {
        name: request.body?.name || undefined,
        price: request.body?.price ? Number(request.body.price) : undefined,
        thumbnail: request.body?.thumbnail || undefined,
      })
      .then((result: Product | ValidationResult | boolean | null) => {
        if (result !== false) {
          if (result === null) {
            response.json({
              error: "Product not found",
            });
          } else {
            isValidationResult(result) === true &&
            (result as ValidationResult).errors.length > 0
              ? response.json({
                  error: "Check the entered fields",
                  errors: (result as ValidationResult).errors,
                })
              : response.json({
                  message: "Successfully edited product",
                  product: result,
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
          error: "An error occurred while trying to edit the product",
        });
      });
  })
  .delete("/:id", isAdmin, async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .remove(request.params.id)
      .then((result: boolean | null) => {
        if (result !== false) {
          if (result === null) {
            response.json({
              error: "Product not found",
            });
          } else {
            response.json({
              message: "Product removed successfully",
            });
          }
        } else {
          response.json({
            error: "An error occurred while trying to delete the record",
          });
        }
      })
      .catch((err) => {
        response.json({
          error: "An error occurred while trying to remove the product",
        });
      });
  });

export default routes;
