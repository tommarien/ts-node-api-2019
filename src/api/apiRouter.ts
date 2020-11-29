import { Router } from 'express';
import apiKeyAuth from '../middleware/apiKeyAuth';

const apiRouter = Router();

// Router specific middleware
apiRouter.use(apiKeyAuth);

export default apiRouter;
