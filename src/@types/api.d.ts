// eslint-disable-next-line import/no-unresolved
import * as core from 'express-serve-static-core';

import { Router } from 'express';

export type Environment = 'local' | 'dev' | 'sta' | 'pro';

export type Params<T> = T & core.ParamsDictionary;

export type Query<T> = T & core.ParamsDictionary;

export type RouterInstaller = (router: Router) => void;

export type Mapper<S, T> = (src: Readonly<S>) => T;
