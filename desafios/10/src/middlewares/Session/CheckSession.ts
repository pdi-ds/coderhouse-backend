import { NextFunction, Request, Response } from "express";

function checkSession(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (
    typeof request.session.user === "undefined" ||
    typeof request.session.admin === "undefined"
  ) {
    return response.status(401).render("not-authenticated");
  }
  next();
}

export { checkSession };
