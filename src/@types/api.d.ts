import { Router, RequestHandler } from 'express';

export type Environment = 'local' | 'dev' | 'sta' | 'pro';

export type ParamsDictionary = RequestHandler extends RequestHandler<infer X> ? X : never;

export type RouterInstaller = (router: Router) => void;

export type Mapper<S, T> = (src: S) => T;
