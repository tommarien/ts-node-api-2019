import { format } from 'date-fns';
import { Mapper } from '../../../@types/api';
import Contact from '../../../domain/contact';

import { ContactRequestBodyV1 } from '../../schemas/types/contact.request.body.v1';

export interface ContactResourceV1 extends ContactRequestBodyV1 {
  id: string;
}

export const contactToResourceMapper: Mapper<Contact, ContactResourceV1> = (src) => {
  const { birthDate, ...rest } = src;

  const resource: ContactResourceV1 = {
    ...rest,
  };

  if (birthDate) resource.birthDate = format(birthDate, 'yyyy-MM-dd');

  return resource;
};
