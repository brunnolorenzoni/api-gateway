import express, { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cookieParser from 'cookie-parser'
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import ErrorMiddleware from "./middleware/Error";
import AuthorizationParams from "./middleware/AuthorizationParams";
import AuthorizationVerify from "./middleware/AuthorizationVerify";

class App {
  public app: Application;

  public constructor() {
    this.app = express();
    this.middlewares();
    this.proxy();
    this.onError()
  }

  private middlewares(): void {
    this.app.use(cookieParser());
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(AuthorizationParams);
    this.app.use(AuthorizationVerify);
  }

  private proxy(): void {
    this.app.use(
      "/",
      createProxyMiddleware({
        target: "http://localhost:3000/healths",
        changeOrigin: true,
        pathRewrite: {
          "^/": "/",
        },
      })
    );
  }

  private onError(): void {
    this.app.use(ErrorMiddleware)
  }

}

export default new App().app;
