import { Router } from 'express';
import { ClientBase } from 'pg';

declare namespace Api {
  export type Environment = 'local' | 'dev' | 'sta' | 'pro';

  export type RouterInstaller = (router: Router) => void;

  export type QueryClient = Pick<ClientBase, 'query'>;
}

export = Api;
