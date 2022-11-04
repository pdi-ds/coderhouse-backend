import { Request, Response, NextFunction } from "express";
import config from "../../config/config";

function isAdmin(request: Request, response: Response, next: NextFunction) {
  config.IS_ADMIN === true
    ? next()
    : response.status(401).json({
        errorCode: -1,
        error: `${request.method}:${request.baseUrl}${request.url} not authorized`,
      });
}

function catchAll(request: Request, response: Response) {
  response.status(404);
  response.json({
    errorCode: -2,
    error: `${request.method}:${request.baseUrl}${request.url} not implemented`,
  });
}

export { isAdmin, catchAll };
