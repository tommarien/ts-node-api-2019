import { AsyncRequestHandler } from '../../../@types/api';
import contactRepository from '../../../data/contactRepository';
import Contact from '../../../domain/contact';
import asyncWrap from '../../middleware/asyncWrap';
import validate from '../../middleware/validate';
import ContactBodySchema from '../../schemas/src/contact.request.body.v1.json';
import { ContactRequestBodyV1 } from '../../schemas/types/contact.request.body.v1';
import { ContactResourceV1, contactToResourceMapper } from './resources';

const postHandler: AsyncRequestHandler<unknown, ContactRequestBodyV1, ContactResourceV1> = async (req, res) => {
  const {
    body: { firstName, lastName, email, birthDate },
  } = req;

  const contact = new Contact(firstName, lastName, email);
  if (birthDate) contact.birthDate = new Date(birthDate);

  await contactRepository.add(contact);

  const reply = contactToResourceMapper(contact);
  res.send(reply);
};

export default [validate({ body: ContactBodySchema }), asyncWrap(postHandler)];
