import { RequestHandler } from 'express';
import validate from '../../middleware/validate';
import userBodySchema from '../../../schemas/src/user.body.v1.json';
import { UserBodyV1 } from '../../../schemas/types/user.body.v1';

const postUserV1: RequestHandler<unknown, Record<string, unknown>, UserBodyV1> = (req, res): void => {
  const { body } = req;

  res.send({ body });
};

export default [validate({ body: userBodySchema }), postUserV1];
