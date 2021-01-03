import { RequestHandler } from 'express';
import validate from '../../middleware/validate';
import userBodySchema from '../../schemas/src/user.request.body.v1.json';
import { UserRequestBodyV1 } from '../../schemas/types/user.request.body.v1';
import userRepository from '../../services/userRepository';
import { mapToResource, UserResource } from './userResource';

const postUserV1: RequestHandler<unknown, UserResource, UserRequestBodyV1> = async (req, res): Promise<void> => {
  const {
    body: { birthDate, ...rest },
  } = req;

  const user = await userRepository.create({
    ...rest,
    ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
  });

  const resBody: UserResource = mapToResource(user);

  res.send(resBody);
};

export default [validate({ body: userBodySchema }), postUserV1];
