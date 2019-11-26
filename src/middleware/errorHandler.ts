import { ErrorRequestHandler } from 'express';
import { boomify } from '@hapi/boom';

import createLogger from '../utils/createLogger';

const logger = createLogger('error-handler');

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) return next();

  const {
    output: { headers, statusCode, payload },
    isServer,
  } = boomify(err);

  if (isServer) logger.error({ err, req });

  return res //
    .set(headers)
    .status(statusCode)
    .send(payload);
};

export default errorHandler;
