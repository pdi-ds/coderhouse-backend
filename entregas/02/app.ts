import Server from "./src/services/Server/Server";
const server: Server = new Server(process.env.PORT || 8080);

server.start();
