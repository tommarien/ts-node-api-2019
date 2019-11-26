import express from 'express';
import catchAllRouteHandler from './middleware/catchAllRouteHandler';
import errorHandler from './middleware/errorHandler';

const app = express();

// All other routes return status 404
app.use(catchAllRouteHandler);

// Register our errorHandler
app.use(errorHandler);

export default app;
