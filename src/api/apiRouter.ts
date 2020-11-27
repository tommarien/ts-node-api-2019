import { Router } from 'express';
import apiKeyAuthentication from '../middleware/apiKeyAuthentication';

const apiRouter = Router();

// Router specific middleware
apiRouter.use(apiKeyAuthentication);

export default apiRouter;
