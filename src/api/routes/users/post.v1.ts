import validate from '../../middleware/validate';
import userBodySchema from '../../schemas/src/user.request.body.v1.json';
import { UserRequestBodyV1 } from '../../schemas/types/user.request.body.v1';
import { userToResourceMapper, UserResource } from './resources';
import userRepository from '../../../data/userRepository';
import User from '../../../domain/user';
import { AsyncRequestHandler } from '../../../@types/api';
import asyncWrap from '../../middleware/asyncWrap';

const postUserV1: AsyncRequestHandler<unknown, UserRequestBodyV1, UserResource> = async (req, res) => {
  const {
    body: { firstName, lastName, email, birthDate },
  } = req;

  const user = new User(firstName, lastName, email);
  if (birthDate) user.birthDate = new Date(birthDate);

  await userRepository.save(user);

  const reply = userToResourceMapper(user);
  res.send(reply);
};

export default [validate({ body: userBodySchema }), asyncWrap(postUserV1)];
