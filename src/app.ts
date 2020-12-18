import express from 'express';
import swaggerUi from 'swagger-ui-express';
import apiRouter from './routes/apiRouter';
import catchAll from './middleware/catchAll';
import enforceHttps from './middleware/enforceHttps';
import errorHandler from './middleware/errorHandler';
import requestId from './middleware/requestId';
import swaggerDocument from './swagger';

const app = express();

// Heroku uses X-Forwarded-Proto header to indicate protocol
app.set('trust proxy', true);

// global middleware
app.use(express.json());
app.use(requestId);

if (process.env.ENFORCE_HTTPS === 'true') {
  app.use(enforceHttps);
}

// register api routes
app.use('/api', apiRouter);
app.use('/api/*', catchAll);

// expose swagger docs
if (process.env.EXPOSE_API_DOCS === 'true') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Register our errorHandler
app.use(errorHandler);

export default app;
