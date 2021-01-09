import { format } from 'date-fns';
import { UserResource } from '../api/resources';
import { User } from '../models/user';

export function toResource(user: User): UserResource {
  const { birthDate, ...rest } = user;

  const resource: UserResource = {
    ...rest,
  };

  if (birthDate) resource.birthDate = format(birthDate, 'yyyy-MM-dd');

  return resource;
}
