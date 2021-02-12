import { notFound } from '@hapi/boom';
import { AsyncRequestHandler } from '../../../@types/api';
import contactRepository from '../../../data/contactRepository';
import asyncWrap from '../../middleware/asyncWrap';
import validate from '../../middleware/validate';
import UuidParamsSchema from '../../schemas/src/uuid.resource.id.params.json';
import { UuidResourceIdParams } from '../../schemas/types/uuid.resource.id.params';
import { ContactResourceV1, contactToResourceMapper } from './resources';

export const getHandler: AsyncRequestHandler<UuidResourceIdParams, unknown, ContactResourceV1> = async (req, res) => {
  const { id } = req.params;

  const contact = await contactRepository.findById(id);
  if (!contact) throw notFound(`A "contact" resource identified with "${id}" was not found`);

  const reply = contactToResourceMapper(contact);
  res.send(reply);
};

export default [validate({ params: UuidParamsSchema }), asyncWrap(getHandler)];
