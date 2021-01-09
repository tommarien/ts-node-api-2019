import { RequestHandler } from 'express';
import { notFound } from '@hapi/boom';

const catchAll: RequestHandler = (_req, _res, next) => next(notFound());

export default catchAll;
