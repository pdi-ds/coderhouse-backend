import express = require("express");
import { Express, Request, Response } from "express";
import { AddressInfo } from "net";
import { config } from "dotenv";
import session = require("express-session");
import routes from "./src/routes/Auth/Auth";
import { engine } from "express-handlebars";
import passport = require("passport");
import yargs = require("yargs");
import { hideBin } from "yargs/helpers";
import cluster from "cluster";
import * as os from "os";
import { ChildProcess, fork } from "child_process";

type CLIArgs = {
  [x: string]: unknown;
  port: number;
  mode: string;
  cpus: number;
  _: (string | number)[];
  $0: string;
};

const argv: CLIArgs | Promise<CLIArgs> = yargs(hideBin(process.argv)).option({
  port: { type: "number", default: 8080, alias: "p" },
  mode: { type: "string", default: "fork", alias: "m" },
  cpus: { type: "number", default: os.cpus().length, alias: "c" },
}).argv as CLIArgs;

const { port, mode, cpus } = argv;

config();

const PORT: string | number = process.env.PORT || port;

if (mode === "cluster" && cluster.isPrimary === true) {
  console.log(`Running main process on (PID: ${process.pid}).`);
  for (let x = 0, max = cpus; x < Math.min(max, os.cpus().length); x = x + 1) {
    cluster.fork();
  }
} else {
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
  app
    .get("/info", (request: Request, response: Response) => {
      response.render("info", {
        platform: process.platform,
        argv: JSON.stringify(argv),
        execPath: process.execPath,
        pid: process.pid,
        memory: process.memoryUsage.rss(),
        version: process.version,
        cpus: os.cpus().length,
      });
    })
    .get("/api/randoms", (request: Request, response: Response) => {
      response.setHeader("Content-Type", "application/json; charset=UTF-8");
      const forked: ChildProcess = fork("./scripts/randoms.ts");
      forked
        .on("message", (message: { randoms: Array<number> }) => {
          response.json({ randoms: message.randoms });
        })
        .send({
          command: "start",
          amount: Number(request.query?.amount) || 1e8,
        });
    })
    .get("*", (request: Request, response: Response) => {
      response.status(404).render("error-404");
    });

  const server = app.listen(PORT, () => {
    const { port } = server.address() as AddressInfo;
    console.log(`Subproceso corriendo en puerto ${port} (PID: ${process.pid})`);
  });

  server.on("error", (err: string) => {
    console.log(`Ocurrió un error ${err}.`);
  });
}
