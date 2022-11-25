import { NextFunction, Request, Response, Router } from "express";
import passport = require("passport");
import { Strategy } from "passport-local";
import Mongo from "../../data-access/Mongo/Mongo";
import config from "../../config/mongodb";
import { compare, create } from "../../utils/utils";

type User = {
  [key: string]: String | undefined;
  _id?: String | undefined;
  username: String;
  password: String;
};

const db = new Mongo(config, "users");
db.setAggregationFields({
  $project: {
    _id: 0,
    id: "$_id",
    username: 1,
  },
});

passport.use(
  "login",
  new Strategy(async (username: string, password: string, done) => {
    await db.collection.findOne({ username }).then((result) => {
      if (result === null || compare(password, result.password) === false)
        done(null, false);
      else done(null, result._id);
    });
  })
);

passport.use(
  "signup",
  new Strategy(
    {
      passReqToCallback: true,
    },
    async (request: Request, username: string, password: string, done) => {
      await db.collection.findOne({ username }).then(async (result) => {
        if (result !== null) done(null, false);
        else
          await db
            .insert({ username, password: create(password) })
            .then((result) => done(null, result));
      });
    }
  )
);

passport.serializeUser((id, done) => done(null, id));
passport.deserializeUser(
  async (id, done) => await db.get(id).then((result) => done(null, result))
);

const routes = Router();

routes
  .get("/login", (request: Request, response: Response) => {
    if (request.isAuthenticated() === true)
      return response.render("user-profile", { ...request.user });
    response.render("login", {
      error: request.query.hasOwnProperty("error") ? true : false,
    });
  })
  .post(
    "/login",
    passport.authenticate("login", {
      failureRedirect: "/login?error",
      successRedirect: "/login",
    })
  )
  .get(
    "/signup",
    (request: Request, response: Response, next: NextFunction) => {
      if (request.isAuthenticated() === true)
        return response.redirect("/login");
      next();
    },
    (request: Request, response: Response) => {
      response.render("signup", {
        error: request.query.hasOwnProperty("error") ? true : false,
      });
    }
  )
  .post(
    "/signup",
    passport.authenticate("signup", {
      failureRedirect: "/signup?error",
      successRedirect: "/login",
    })
  )
  .get("" + "/logout", (request: Request, response: Response) => {
    request.logout((err) => {});
    response.redirect("/login");
  })
  .get("*", (request: Request, response: Response) => {
    response.status(404).render("error-404");
  });

export default routes;
