import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs';
import path from 'path';

import { config } from './config/env';
import database from './config/database';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import sweetRoutes from './routes/sweets';
import ordersRoutes from './routes/orders';

// Note: Do not eagerly load the swagger file at module import time.
// In production deployments the file may not be present at the same
// relative path (causing an exception). Load it lazily inside
// `initializeSwagger()` from resolved candidate locations.

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.connectDatabase();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async connectDatabase(): Promise<void> {
    await database.connect();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: config.nodeEnv === 'production' 
        ? ['https://ai-kata-sweetshop.vercel.app']
        : ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true
    }));
    
    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Rate limiting
    this.app.use(
      rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        message: {
          success: false,
          message: 'Too many requests from this IP, please try again later.'
        }
      })
    );
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        database: database.isDBConnected() ? 'connected' : 'disconnected'
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/sweets', sweetRoutes);
    this.app.use('/api/orders', ordersRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
      });
    });
  }

  private initializeSwagger(): void {
    if (config.nodeEnv !== 'production') {
      // Try multiple locations where swagger.yaml could be placed
      const candidates = [
        path.join(__dirname, '..', '..', 'swagger.yaml'), // built/dist layout
        path.join(__dirname, '..', 'swagger.yaml'), // src adjacent
        path.join(process.cwd(), 'swagger.yaml'), // current working dir
        path.join(process.cwd(), 'backend', 'swagger.yaml'), // monorepo layout
      ];

      const swaggerPath = candidates.find(p => fs.existsSync(p));
      if (!swaggerPath) {
        console.warn('[Swagger] swagger.yaml not found in expected locations, skipping /api-docs');
        return;
      }

      try {
        const swaggerDocument = YAML.load(swaggerPath);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        console.log(`[Swagger] Loaded documentation from ${swaggerPath}`);
      } catch (err) {
        console.warn('[Swagger] Failed to load swagger.yaml, skipping /api-docs', err);
      }
    }
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
      console.log(`⚡ Environment: ${config.nodeEnv}`);
    });
  }
}

// Create and export app instance
const app = new App().app;

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  new App().listen();
}

export default app;