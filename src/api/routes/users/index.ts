import { RouteInstaller } from '../../../@types/api';
import deleteV1 from './delete.v1';
import getV1 from './get.v1';
import postV1 from './post.v1';

export const userRouterInstaller: RouteInstaller = (router) => {
  router //
    .route('/v1/users')
    .post(postV1);

  router //
    .route('/v1/users/:id')
    .get(getV1)
    .delete(deleteV1);
};
