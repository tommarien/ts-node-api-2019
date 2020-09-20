import { ErrorRequestHandler } from 'express';
import { boomify } from '@hapi/boom';

import loggerFactory from '../utils/loggerFactory';

const logger = loggerFactory('error-handler');

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    logger.error({ err, req, res }, 'Error occurred but headers already sent');
    return next();
  }

  const {
    output: { headers, statusCode, payload },
    isServer,
  } = boomify(err);

  if (isServer) logger.error({ err, req }, 'Server error occurred');

  return res //
    .set(headers)
    .status(statusCode)
    .send(payload);
};

export default errorHandler;
