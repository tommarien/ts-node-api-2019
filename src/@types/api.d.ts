import { Router } from 'express';

declare namespace Api {
  export type Environment = 'local' | 'dev' | 'sta' | 'pro';

  export type RouterInstaller = (router: Router) => void;
}

export = Api;
