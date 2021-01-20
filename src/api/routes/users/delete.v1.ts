import { notFound } from '@hapi/boom';
import { RequestHandler } from 'express';
import { Params } from '../../../@types/api';
import userRepository from '../../../data/userRepository';
import validate from '../../middleware/validate';
import UuidParamsSchema from '../../schemas/src/uuid.resource.id.params.json';
import { UuidResourceIdParams } from '../../schemas/types/uuid.resource.id.params';

const deleteUserV1: RequestHandler<Params<UuidResourceIdParams>> = async (req, res, next): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await userRepository.deleteById(id);
    if (!deleted) throw notFound(`A "user" resource identified with "${id}" was not found`);

    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export default [validate({ params: UuidParamsSchema }), deleteUserV1 as RequestHandler];
