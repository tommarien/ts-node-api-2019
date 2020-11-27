import { RequestHandler } from 'express';

const enforceHttps: RequestHandler = (req, res, next) => {
  if (req.secure) next();
  else if (['GET', 'HEAD'].includes(req.method)) res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
  else res.status(403).send({ statusCode: 403, error: 'Forbidden', message: 'SSL Required' });
};

export default enforceHttps;
