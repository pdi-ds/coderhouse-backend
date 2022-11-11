import express = require("express");
import http = require("http");
import { Express, Request, Response, Router } from "express";
import { AddressInfo } from "net";
import { Server, Socket } from "socket.io";
import { engine } from "express-handlebars";
import Products, { Product } from "./src/services/Products/Products";
import Messages from "./src/services/Messages/Messages";

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

const products: Products = new Products();
const messages: Messages = new Messages();
const routes: Router = Router();

routes
  .get("/", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "text/html; charset=UTF-8");
    response.render("main");
  })
  .get("/api/productos-test", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    const result: Array<Product> = products.getAll();
    response.json({ products: result });
  });

app.use(routes);

server.listen(PORT, () => {
  const { port } = server.address() as AddressInfo;
  console.log(`server running on port ${port}!`);
});

server.on("error", (err: string) => {
  console.log(`An error occurred: ${err}.`);
});

io.on("connection", async (socket: Socket) => {
  const result = products.getAll();
  socket.emit("products", { products: result });
  await messages.getAll().then((result) => {
    console.log(JSON.stringify(messages.normalize(result)));
    socket.emit("messages", { messages: result });
  });
  socket.on(
    "message",
    async ({ email, first_name, last_name, alias, age, avatar, message }) => {
      await messages.create({
        author: { email, first_name, last_name, alias, age, avatar },
        text: message,
      });
      messages
        .getAll()
        .then((result) => io.sockets.emit("messages", { messages: result }));
    }
  );
});
