import { RequestHandler } from 'express';
import { notFound } from '@hapi/boom';

const catchAllRouteHandler: RequestHandler = () => {
  throw notFound();
};

export default catchAllRouteHandler;
