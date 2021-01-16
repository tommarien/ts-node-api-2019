import { RequestHandler } from 'express';
import validate from '../../middleware/validate';
import userBodySchema from '../../schemas/src/user.request.body.v1.json';
import { UserRequestBodyV1 } from '../../schemas/types/user.request.body.v1';
import { userToResourceMapper, UserResource } from './resources';
import userRepository from '../../../data/userRepository';
import User from '../../../domain/user';

const postUserV1: RequestHandler<unknown, UserResource, UserRequestBodyV1> = async (req, res, next): Promise<void> => {
  try {
    const {
      body: { firstName, lastName, email, birthDate },
    } = req;

    const user = new User(firstName, lastName, email);

    if (birthDate) user.birthDate = new Date(birthDate);

    await userRepository.save(user);

    const body = userToResourceMapper(user);
    res.send(body);
  } catch (e) {
    next(e);
  }
};

export default [validate({ body: userBodySchema }), postUserV1];
