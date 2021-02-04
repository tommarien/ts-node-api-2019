import { notFound } from '@hapi/boom';
import { UserResource, userToResourceMapper } from './resources';
import validate from '../../middleware/validate';
import UuidParamsSchema from '../../schemas/src/uuid.resource.id.params.json';
import { UuidResourceIdParams } from '../../schemas/types/uuid.resource.id.params';
import asyncWrap from '../../middleware/asyncWrap';
import { AsyncRequestHandler } from '../../../@types/api';
import userRepository from '../../../data/userRepository';

export const getUserV1: AsyncRequestHandler<UuidResourceIdParams, unknown, UserResource> = async (req, res) => {
  const { id } = req.params;

  const user = await userRepository.findById(id);
  if (!user) throw notFound(`A "user" resource identified with "${id}" was not found`);

  const reply = userToResourceMapper(user);
  res.send(reply);
};

export default [validate({ params: UuidParamsSchema }), asyncWrap(getUserV1)];
