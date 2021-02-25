import { RequestHandler } from 'express';
// eslint-disable-next-line import/no-unresolved
import * as core from 'express-serve-static-core';
import { AsyncRequestHandler } from '../../@types/api';

const asyncWrap: <Params = core.ParamsDictionary, Body = unknown, Reply = unknown>(
  handler: AsyncRequestHandler<Params, Body, Reply>
) => RequestHandler<Params & core.ParamsDictionary, Reply, Body> = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res)).catch(next);
};

export default asyncWrap;
