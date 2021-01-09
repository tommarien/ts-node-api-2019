import { RouterInstaller } from '../../../@types/api';
import get from './get.v1';
import post from './post.v1';

export const userRouterInstaller: RouterInstaller = (router) => {
  router //
    .route('/v1/users')
    .post(post);

  router //
    .route('/v1/users/:id')
    .get(get);
};
