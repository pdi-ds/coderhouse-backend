import express = require("express");
import { Express } from "express";
import { AddressInfo } from "net";
import routes from "./src/routes/Products/Products";

const PORT: number | string = process.env.PORT || 8080;
const app: Express = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
app.use(routes);
const server = app.listen(PORT, () => {
  const { port } = server.address() as AddressInfo;
  console.log(`Server running on the port ${port}!`);
});
server.on("error", (err: string) => {
  console.log(`Error ${err}.`);
});
