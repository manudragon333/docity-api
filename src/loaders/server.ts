import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import morgan from "morgan";
import passport from "passport";
import { API_CALL_LOG_FORMAT, REQUEST_BODY_LIMIT, SAVE_FILES } from "./config";
import { Log } from "models";
import path from "path";
import { isAuthenticated } from "middlewares/authentication";

export default (app: Application) => {
  Log.info("initializationExpressServer()");
  const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    methods: "",
    exposedHeaders: "message,showMessage,accessToken",
  };

  const stream = {
    write: (message: string) => {
      Log.info(message);
    },
  };

  app.use(
    bodyParser.urlencoded({
      limit: `${REQUEST_BODY_LIMIT}mb`,
      extended: true,
    })
  );

  app.use(
    bodyParser.json({
      limit: `${REQUEST_BODY_LIMIT}mb`,
    })
  );

  app.use(cors(corsOptions));

  app.use(morgan(API_CALL_LOG_FORMAT, { stream }));
  const publicPath = path.resolve("./" + SAVE_FILES);
  app.use("/" + SAVE_FILES, isAuthenticated, express.static(publicPath));

  app.use(passport.initialize());
  app.use(passport.session());
};
