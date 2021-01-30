import { notFound } from '@hapi/boom';
import validate from '../../middleware/validate';
import userBodySchema from '../../schemas/src/user.request.body.v1.json';
import { UserRequestBodyV1 } from '../../schemas/types/user.request.body.v1';
import { userToResourceMapper, UserResource } from './resources';
import userRepository from '../../../data/userRepository';
import { AsyncRequestHandler } from '../../../@types/api';
import asyncWrap from '../../middleware/asyncWrap';
import UuidParamsSchema from '../../schemas/src/uuid.resource.id.params.json';
import { UuidResourceIdParams } from '../../schemas/types/uuid.resource.id.params';

const postUserV1: AsyncRequestHandler<UuidResourceIdParams, UserRequestBodyV1, UserResource> = async (req, res) => {
  const {
    params: { id },
    body: { firstName, lastName, email, birthDate },
  } = req;

  const user = await userRepository.findById(id);
  if (!user) throw notFound(`A "user" resource identified with "${id}" was not found`);

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.birthDate = birthDate ? new Date(birthDate) : undefined;

  await userRepository.update(user);

  const body = userToResourceMapper(user);
  res.send(body);
};

export default [validate({ params: UuidParamsSchema, body: userBodySchema }), asyncWrap(postUserV1)];
