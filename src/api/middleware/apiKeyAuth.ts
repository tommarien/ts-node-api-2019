import { RequestHandler } from 'express';
import loggerFactory from '../../core/loggerFactory';

const logger = loggerFactory('apiKeyAuthentication');
const API_KEY_HEADER_NAME = 'X-Api-Key';

if (!process.env.ALLOWED_API_KEYS) logger.warn('No ALLOWED_API_KEYS env variable set!');
const ALLOWED_API_KEYS = process.env.ALLOWED_API_KEYS ? process.env.ALLOWED_API_KEYS.split(';') : [];

const buildUnauthorized = (message: string) => ({ statusCode: 401, error: 'Unauthorized', message });

const apiKeyAuthentication: RequestHandler = (req, res, next) => {
  const apiKey = req.get(API_KEY_HEADER_NAME);

  if (!apiKey) res.status(401).send(buildUnauthorized('No Api key specified (X-API-Key header)'));
  else if (!ALLOWED_API_KEYS.includes(apiKey))
    res.status(401).send(buildUnauthorized('The API key provided is invalid'));
  else {
    req.apiKey = apiKey;
    next();
  }
};

export default apiKeyAuthentication;
