import { RequestHandler } from 'express';
import { notFound } from '@hapi/boom';

const catchAllRouteHandler: RequestHandler = (_req, _res, next) => next(notFound());

export default catchAllRouteHandler;
