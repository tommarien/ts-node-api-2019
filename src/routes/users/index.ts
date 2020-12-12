import { RouterInstaller } from '../../@types/api';
import post from './post.v1';

export const userRouterInstaller: RouterInstaller = (router) => {
  router //
    .route('/v1/users')
    .post(post);
};
