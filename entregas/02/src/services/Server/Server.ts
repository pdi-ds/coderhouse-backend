import express = require("express");
import { Express } from "express";
import { Server as HttpServer } from "http";
import { AddressInfo } from "net";
import products from "../../routes/Products/Products";
import carts from "../../routes/Carts/Carts";
import { catchAll } from "../../routes/Utils/Utils";

class Server {
  private readonly port: number;
  private readonly app: Express;
  private server!: HttpServer;

  constructor(port: number | string = 8080) {
    this.port = Number(port);
    this.app = express();
    this.app.use(express.json());
    this.app.use("/api/productos", products);
    this.app.use("/api/carrito", carts);
    this.app.all("*", catchAll);
  }

  getApp(): Express {
    return this.app;
  }

  start(): void {
    this.server = this.app.listen(this.port, () => {
      const { port } = this.server.address() as AddressInfo;
      console.log(`Server running on port ${port}!`);
    });
    this.server.on("error", (err: string) => {
      console.log(`An error occurred ${err}.`);
    });
  }
}

export default Server;
