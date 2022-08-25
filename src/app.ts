import express, { Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import ErrorMiddleware from './middleware/Error';
import proxyConfig from './config/proxy.config'
import auth from './middleware/Auth'


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
    this.app.use(morgan('dev'));
    this.app.use(helmet());
    this.app.use(cors({
      credentials: true,
      origin: ['http://localhost:5500'],
    }));
    this.app.use(auth)
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
            [nameRoute]: '/',
          },
        }))
      })
    });
  }

  private onError(): void {
    this.app.use(ErrorMiddleware)
    
    this.app.all('*', function(req, res, next){
      res.status(404).send('Not Found')
  });
  }

}

export default new App().app;
