import { RequestHandler } from 'express';
import validate from '../../middleware/validate';
import userBodySchema from '../../schemas/src/user.req.body.v1.json';
import { UserReqBodyV1 } from '../../schemas/types/user.req.body.v1';

const postUserV1: RequestHandler<unknown, Record<string, unknown>, UserReqBodyV1> = (req, res): void => {
  const { body } = req;

  res.send({ body });
};

export default [validate({ body: userBodySchema }), postUserV1];
