/**
 * Express application factory
 *
 * Separating app from server.ts allows the app to be imported in tests
 * without starting the HTTP server.
 *
 * Middleware order (important):
 *   1. helmet         — security headers
 *   2. cors           — CORS before any route handling
 *   3. rateLimiter    — reject limit-exceeded requests early
 *   4. morgan         — log after CORS so OPTIONS preflight isn't logged as errors
 *   5. json parser    — body parsing
 *   6. responseWrapper— attach res.success() before routes run
 *   7. routes         — application routes
 *   8. notFoundHandler— catch unmatched routes
 *   9. errorHandler   — convert all errors to JSON
 */

import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimiter } from './middleware/rateLimiter.middleware';
import { responseWrapper } from './middleware/responseWrapper';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import companiesRouter from './routes/companies.routes';
import investorsRouter from './routes/investors.routes';
import foundersRouter from './routes/founders.routes';
import utilityRouter from './routes/utility.routes';
import productsRouter from './routes/products.routes';
import newsRouter from './routes/news.routes';

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  }),
);

// ─── Rate limiting ────────────────────────────────────────────────────────────
app.use(rateLimiter);

// ─── Request logging ──────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Response wrapper ─────────────────────────────────────────────────────────
app.use(responseWrapper);

// ─── Health check (unauthenticated, no rate limit applied above) ──────────────
app.get('/health', (_req, res) => {
  res.json({
    data: { status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV },
    meta: { timestamp: new Date().toISOString() },
    error: null,
  });
});

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/companies', companiesRouter);
app.use('/investors', investorsRouter);
app.use('/founders', foundersRouter);
app.use('/products', productsRouter);
app.use('/news', newsRouter);
app.use('/', utilityRouter);

// ─── 404 + Error handling (must be last) ─────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
