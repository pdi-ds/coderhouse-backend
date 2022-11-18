import express = require("express");
import { Express } from "express";
import { AddressInfo } from "net";
import { config } from "dotenv";
import session = require("express-session");
import MongoStore = require("connect-mongo");
import routes from "./src/routes/Auth/Auth";
import { engine } from "express-handlebars";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY || "sessionPassword",
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://dbuser:WloecdhaHArjVZOz@cluster0.ggenyto.mongodb.net/?retryWrites=true&w=majority",
      ttl: 600,
    }),
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000,
      httpOnly: true,
    },
  })
);

app.use(routes);

const server = app.listen(PORT, () => {
  const { port } = server.address() as AddressInfo;
  console.log(`Server running on port ${port}!`);
});

server.on("error", (err: string) => {
  console.log(`An error occurred ${err}.`);
});
