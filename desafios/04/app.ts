import express = require("express");
import { Express } from "express";
import { AddressInfo } from "net";
import routes from "./routes/Products/Products";

const PORT: number | string = process.env.PORT || 8080;
const app: Express = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use("/api/productos", routes);
const server = app.listen(PORT, () => {
  const { port } = server.address() as AddressInfo;
  console.log(`Server running on the port ${port}`);
});
server.on("error", (err: string) => {
  console.log(`Error ${err}.`);
});
