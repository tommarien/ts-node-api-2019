// eslint-disable-next-line import/no-unresolved
import * as core from 'express-serve-static-core';
import { RequestHandler } from 'express';
import { AsyncRequestHandler } from '../../@types/api';

const asyncWrap: <Params = core.ParamsDictionary, Body = unknown, Reply = unknown>(
  handler: AsyncRequestHandler<Params, Body, Reply>
) => RequestHandler<Params & core.ParamsDictionary, Reply, Body> = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res)).catch(next);
  };
};

export default asyncWrap;
