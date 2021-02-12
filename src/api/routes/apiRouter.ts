import { Router } from 'express';
import apiKeyAuth from '../middleware/apiKeyAuth';
import { contactRouterInstaller } from './contacts';

const apiRouter = Router();

// Router specific middleware
apiRouter.use(apiKeyAuth);

// Register routes
contactRouterInstaller(apiRouter);

export default apiRouter;
