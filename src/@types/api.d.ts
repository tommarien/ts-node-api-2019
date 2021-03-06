import { Request, Response, Router } from 'express';
// eslint-disable-next-line import/no-unresolved
import * as core from 'express-serve-static-core';

export type Environment = 'local' | 'dev' | 'sta' | 'pro';

export type RouteInstaller = (router: Router) => void;

export type Mapper<S, T> = (src: Readonly<S>) => T;

export type AsyncRequestHandler<Params = core.ParamsDictionary, Body = unknown, Reply = unknown> = (
  req: Request<Params & core.ParamsDictionary, Reply, Body>,
  res: Response<Reply>
) => Promise<void>;
