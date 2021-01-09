import { RequestHandler } from 'express';
import { UserResource } from '../../resources';
import validate from '../../middleware/validate';
import userBodySchema from '../../schemas/src/user.request.body.v1.json';
import { UserRequestBodyV1 } from '../../schemas/types/user.request.body.v1';
import { toResource } from '../../../mappers/userMapper';
import userRepository from '../../../data/userRepository';

const postUserV1: RequestHandler<unknown, UserResource, UserRequestBodyV1> = async (req, res, next): Promise<void> => {
  try {
    const {
      body: { birthDate, ...rest },
    } = req;

    const user = await userRepository.save({
      ...rest,
      ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
    });

    const resBody = toResource(user);

    res.send(resBody);
  } catch (e) {
    next(e);
  }
};

export default [validate({ body: userBodySchema }), postUserV1];
