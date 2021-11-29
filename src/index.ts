import express from "express";
import { initializeApp } from "loaders";
import {
  PORT,
  CORS_ORIGIN_URLS,
  SOCKET_SSL_CERT,
  SOCKET_SSL_KEY,
} from "loaders/config";
import { Log } from "models";
import fs from "fs";
import https from "https";
import socketIO from "socket.io";
import { initialiseSocket } from "src/routes/socket";

async function startApplication() {
  try {
    const app: express.Application = express();
    await initializeApp(app);
    const httpServer = https.createServer(
      {
        cert: fs.readFileSync(SOCKET_SSL_CERT),
        key: fs.readFileSync(SOCKET_SSL_KEY),
      },
      app
    );
    const io = new socketIO.Server(httpServer, {
      cors: {
        origin: CORS_ORIGIN_URLS,
        methods: "",
      },
    });
    initialiseSocket(io);
    httpServer.listen(PORT, () => {
      Log.info(`SERVER listening on PORT:${PORT}`);
    });
  } catch (error) {
    Log.error("index", "startApplication()", error);
    Log.debug("Killing Application process");
    process.exit(1);
  }
}

startApplication().catch((error) => {
  Log.error("index", "startApplication()", error);
});
