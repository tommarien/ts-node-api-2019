import { RequestHandler } from 'express';
import validate from '../../middleware/validate';
import userBodySchema from '../../schemas/src/user.resource.v1.json';
import { UserResourceV1 } from '../../schemas/types/user.resource.v1';
import userRepository from '../../services/userRepository';
import { mapToResource, UserResponseV1 } from './userResource';

const postUserV1: RequestHandler<unknown, UserResponseV1, UserResourceV1> = async (req, res): Promise<void> => {
  const {
    body: { birthDate, ...rest },
  } = req;

  const user = await userRepository.create({
    ...rest,
    ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
  });

  const body: UserResponseV1 = mapToResource(user);

  res.send(body);
};

export default [validate({ body: userBodySchema }), postUserV1];
