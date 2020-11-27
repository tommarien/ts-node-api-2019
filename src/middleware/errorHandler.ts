import { ErrorRequestHandler } from 'express';
import { boomify } from '@hapi/boom';

import loggerFactory from '../utils/loggerFactory';

const logger = loggerFactory('errorHandler');

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    logger.error({ err, req, res }, 'error occurred but headers already sent');
    return next();
  }

  const {
    output: { headers, statusCode, payload },
    isServer,
  } = boomify(err, { statusCode: err.statusCode });

  if (isServer) logger.error({ err, req }, 'server error occurred');

  return res //
    .set(headers)
    .status(statusCode)
    .send(payload);
};

export default errorHandler;
