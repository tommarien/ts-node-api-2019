import { Router } from 'express';

export type Environment = 'local' | 'dev' | 'sta' | 'pro';

export type RouterInstaller = (router: Router) => void;

export type Mapper<TFrom, TTo> = (src: TFrom) => TTo;
