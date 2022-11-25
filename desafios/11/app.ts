import express = require("express");
import { Express } from "express";
import { AddressInfo } from "net";
import { config } from "dotenv";
import session = require("express-session");
import routes from "./src/routes/Auth/Auth";
import { engine } from "express-handlebars";
import passport = require("passport");

config();

const PORT: number | string = process.env.PORT || 8080;
const app: Express = express();

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY || "sessionPassword",
    rolling: true,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
      secure: false,
      httpOnly: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

const server = app.listen(PORT, () => {
  const { port } = server.address() as AddressInfo;
  console.log(`Server running on port ${port}!`);
});

server.on("error", (err: string) => {
  console.log(`An error occurred ${err}.`);
});
