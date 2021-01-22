import { notFound } from '@hapi/boom';
import { UserResource, userToResourceMapper } from './resources';
import validate from '../../middleware/validate';
import userRepository from '../../../data/userRepository';
import UuidParamsSchema from '../../schemas/src/uuid.resource.id.params.json';
import { UuidResourceIdParams } from '../../schemas/types/uuid.resource.id.params';
import asyncWrap from '../../middleware/asyncWrap';
import { AsyncRequestHandler } from '../../../@types/api';

export const getUserV1: AsyncRequestHandler<UuidResourceIdParams, undefined, UserResource> = async (req, res) => {
  const { id } = req.params;

  const user = await userRepository.findById(id);
  if (!user) throw notFound(`A "user" resource identified with "${id}" was not found`);

  const body = userToResourceMapper(user);
  res.send(body);
};

export default [validate({ params: UuidParamsSchema }), asyncWrap(getUserV1)];
