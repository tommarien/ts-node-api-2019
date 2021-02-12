import { RouteInstaller } from '../../../@types/api';
import deleteV1 from './delete.v1';
import getV1 from './get.v1';
import postV1 from './post.v1';
import putV1 from './put.v1';

export const contactRouterInstaller: RouteInstaller = (router) => {
  router //
    .route('/v1/contacts')
    .post(postV1);

  router //
    .route('/v1/contacts/:id')
    .get(getV1)
    .put(putV1)
    .delete(deleteV1);
};
