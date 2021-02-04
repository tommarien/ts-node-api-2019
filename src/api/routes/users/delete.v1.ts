import { notFound } from '@hapi/boom';
import { AsyncRequestHandler } from '../../../@types/api';
import userRepository from '../../../data/userRepository';
import asyncWrap from '../../middleware/asyncWrap';
import validate from '../../middleware/validate';
import UuidParamsSchema from '../../schemas/src/uuid.resource.id.params.json';
import { UuidResourceIdParams } from '../../schemas/types/uuid.resource.id.params';

const deleteUserV1: AsyncRequestHandler<UuidResourceIdParams> = async (req, res) => {
  const { id } = req.params;

  const deleted = await userRepository.removeById(id);
  if (!deleted) throw notFound(`A "user" resource identified with "${id}" was not found`);

  res.sendStatus(204);
};

export default [validate({ params: UuidParamsSchema }), asyncWrap(deleteUserV1)];
