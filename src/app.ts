import express, { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cookieParser from 'cookie-parser'
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import ErrorMiddleware from "./middleware/Error";
import proxyConfig from './config/proxy.config'
import AuthorizationParams from "./middleware/AuthorizationParams";
import AuthorizationVerify from "./middleware/AuthorizationVerify";


class App {
  public app: Application;
  private config;

  constructor() {
    this.app = express();
    this.config = proxyConfig();
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

  private proxy(): void{
    if(!this.config.services) throw new Error('Set services on proxy.config.ts')
    this.config.services.forEach(service => {
      const { nameRoute, url, routes } = service
      routes.forEach(resource => {
        const { path } = resource
        const target = `${url}${path}`
        this.app.use(nameRoute, createProxyMiddleware({
          target,
          changeOrigin: true,
          pathRewrite: {
            [nameRoute]: "/",
          },
        }))
      })
    });
  }

  private onError(): void {
    this.app.use(ErrorMiddleware)
  }

}

export default new App().app;
