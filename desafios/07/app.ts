import express = require("express");
import http = require("http");
import { Express, Request, Response, Router } from "express";
import { AddressInfo } from "net";
import { Server, Socket } from "socket.io";
import { engine } from "express-handlebars";
import Products, {
  Product,
  ValidationResult,
} from "./src/services/Products/Products";
import sqlite3 from "./src/config/sqlite3";
import mysql from "./src/config/mysql";
import Messages from "./src/services/Messages/Messages";

const config = process.env.DB_ENGINE === "mysql" ? mysql : sqlite3;
const PORT: number | string = process.env.PORT || 8080;

const app: Express = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

const products: Products = new Products(config);
const messages: Messages = new Messages(config);

const routes: Router = Router();

routes
  .get("/", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "text/html; charset=UTF-8");
    response.render("form");
  })
  .post("/productos", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    const result: Product | ValidationResult | boolean = await products.create({
      name: request.body.name,
      price: Number(request.body.price),
      thumbnail: request.body.thumbnail,
    });
    if (result === false) {
      response.json({
        error: "Ha ocurrido un error al crear el registro en la base de datos",
      });
    } else if (result.hasOwnProperty("errors") === true) {
      response.json({
        error: "Verifica los campos ingresados",
        errors: (result as ValidationResult).errors,
      });
    } else {
      const result = await products.getAll();
      io.sockets.emit("products", { products: result });
      response.json(result);
    }
  });

// Endpoints
app.use(routes);

// Listener
server.listen(PORT, () => {
  const { port } = server.address() as AddressInfo;
  console.log(`Servidor corriendo en puerto ${port}!`);
});

// Error handler
server.on("error", (err: string) => {
  console.log(`Ocurrió un error ${err}.`);
});

// Socket listener
io.on("connection", async (socket: Socket) => {
  const result = await products.getAll();
  socket.emit("products", { products: result });
  await messages
    .getAll()
    .then((messages) => socket.emit("messages", { messages }));
  socket.on("message", async ({ email: from, message }) => {
    await messages.create({ from, message });
    messages
      .getAll()
      .then((messages) => io.sockets.emit("messages", { messages }));
  });
});
