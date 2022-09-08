const express = require("express");
const cors = require("cors");
const router = require("../routes/products.route");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.productsPath = "/";
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }
  routes() {
    this.app.use(this.productsPath, router);
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

module.exports = Server;
