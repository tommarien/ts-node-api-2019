import { Router } from 'express';
import apiKeyAuth from '../middleware/apiKeyAuth';
import { userRouterInstaller } from './users';

const apiRouter = Router();

// Router specific middleware
apiRouter.use(apiKeyAuth);

// Register routes
userRouterInstaller(apiRouter);

export default apiRouter;
