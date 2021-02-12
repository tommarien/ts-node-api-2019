import { notFound } from '@hapi/boom';
import { AsyncRequestHandler } from '../../../@types/api';
import contactRepository from '../../../data/contactRepository';
import asyncWrap from '../../middleware/asyncWrap';
import validate from '../../middleware/validate';
import ContactBodySchema from '../../schemas/src/contact.request.body.v1.json';
import UuidParamsSchema from '../../schemas/src/uuid.resource.id.params.json';
import { ContactRequestBodyV1 } from '../../schemas/types/contact.request.body.v1';
import { UuidResourceIdParams } from '../../schemas/types/uuid.resource.id.params';
import { ContactResourceV1, contactToResourceMapper } from './resources';

const putHandler: AsyncRequestHandler<UuidResourceIdParams, ContactRequestBodyV1, ContactResourceV1> = async (
  req,
  res
) => {
  const {
    params: { id },
    body: { firstName, lastName, email, birthDate },
  } = req;

  const contact = await contactRepository.findById(id);
  if (!contact) throw notFound(`A "contact" resource identified with "${id}" was not found`);

  contact.firstName = firstName;
  contact.lastName = lastName;
  contact.email = email;
  contact.birthDate = birthDate ? new Date(birthDate) : undefined;

  await contactRepository.update(contact);

  const reply = contactToResourceMapper(contact);
  res.send(reply);
};

export default [validate({ params: UuidParamsSchema, body: ContactBodySchema }), asyncWrap(putHandler)];
