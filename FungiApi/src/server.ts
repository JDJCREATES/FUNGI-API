import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import cors from 'cors';

import BaseRouter from './routes/index';
import mushroomRoutes from './routes/mushrooms';

import Paths from './common/constants/Paths';
import ENV from './common/constants/ENV';
import HttpStatusCodes from './common/constants/HttpStatusCodes';
import { RouteError } from './common/util/route-errors';
import { NodeEnvs } from './common/constants';

// Setup
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// CORS setup
app.use(cors({
  origin: ENV.CorsOrigin || '*',
  credentials: true
}));

// Show routes called in console during development
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (ENV.NodeEnv === NodeEnvs.Production) {
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);
app.use(`${Paths.Base}/mushrooms`, mushroomRoutes);  // This line is duplicating the mushroom routes

// Add a test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint is working!' });
});

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to users pg by default
app.get('/', (_: Request, res: Response) => {
  return res.redirect('/users');
});

// Redirect to login if not logged in.
app.get('/users', (_: Request, res: Response) => {
  return res.sendFile('users.html', { root: viewsDir });
});

// Debug routes
app.get('/debug-routes', (req, res) => {
  const routes: any[] = [];
  
  function print(path: string, layer: any) {
    if (layer.route) {
      layer.route.stack.forEach((r: any) => {
        const method = Object.keys(r.route.methods)[0].toUpperCase();
        routes.push({ method, path: path + r.route.path });
      });
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach((stackItem: any) => {
        print(path + layer.regexp.source.replace('^\\/','').replace('\\/?(?=\\/|$)',''), stackItem);
      });
    }
  }
  
  app._router.stack.forEach((layer: any) => {
    print('', layer);
  });
  
  res.json(routes);
});

export default app;
