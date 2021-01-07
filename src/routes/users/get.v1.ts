import { notFound } from '@hapi/boom';
import { RequestHandler } from 'express';
import { toResource } from '../../mappers/userMapper';
import validate from '../../middleware/validate';
import userRepository from '../../repositories/userRepository';
import UuidParamsSchema from '../../schemas/src/uuid.resource.id.params.json';
import { UuidResourceIdParams } from '../../schemas/types/uuid.resource.id.params';

const getUserV1: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id } = (req.params as unknown) as UuidResourceIdParams;

    const user = await userRepository.findById(id);
    if (!user) throw notFound(`A "user" resource identified with "${id}" was not found`);

    const resBody = toResource(user);
    res.send(resBody);
  } catch (e) {
    next(e);
  }
};

export default [validate({ params: UuidParamsSchema }), getUserV1];
