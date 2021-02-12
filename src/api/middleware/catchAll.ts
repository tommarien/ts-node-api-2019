import { notFound } from '@hapi/boom';
import { RequestHandler } from 'express';

const catchAll: RequestHandler = (_req, _res, next) => next(notFound());

export default catchAll;
