import express = require("express");
import { Express } from "express";
import { AddressInfo } from "net";
import products from "./src/routes/Products/Products";
import carts from "./src/routes/Carts/Carts";
import { catchAll } from "./src/routes/Utils/Utils";

const PORT: number | string = process.env.PORT || 8080;
const app: Express = express();
app.use(express.json());
app.use("/api/productos", products);
app.use("/api/carrito", carts);
app.all("*", catchAll);
const server = app.listen(PORT, () => {
  const { port } = server.address() as AddressInfo;
  console.log(`Running in port ${port}!`);
});
server.on("error", (err: string) => {
  console.log(`Error ${err}.`);
});
