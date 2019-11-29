import { RequestHandler } from 'express';
import { notFound } from '@hapi/boom';

const catchAllRouteHandler: RequestHandler = (req, res, next) => next(notFound());

export default catchAllRouteHandler;
