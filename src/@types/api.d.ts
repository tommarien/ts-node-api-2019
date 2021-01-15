import { Router, RequestHandler } from 'express';

export type Environment = 'local' | 'dev' | 'sta' | 'pro';

export type ParamsDictionary = RequestHandler extends RequestHandler<infer X> ? X : never;

export type RouterInstaller = (router: Router) => void;

export type Mapper<S, T> = (src: Readonly<S>) => T;

export type Optional<T, K extends keyof T = keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
