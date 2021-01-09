import { notFound } from '@hapi/boom';
import { RequestHandler } from 'express';
import { userToResourceMapper } from './resources';
import validate from '../../middleware/validate';
import userRepository from '../../../data/userRepository';
import UuidParamsSchema from '../../schemas/src/uuid.resource.id.params.json';

const getUserV1: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await userRepository.findById(id);
    if (!user) throw notFound(`A "user" resource identified with "${id}" was not found`);

    const body = userToResourceMapper(user);
    res.send(body);
  } catch (e) {
    next(e);
  }
};

export default [validate({ params: UuidParamsSchema }), getUserV1];
