import { format } from 'date-fns';
import { User } from '../@types/models';
import { UserResource } from '../@types/resources';

export function toResource(user: User): UserResource {
  const { birthDate, ...rest } = user;

  const resource: UserResource = {
    ...rest,
  };

  if (birthDate) resource.birthDate = format(birthDate, 'yyyy-MM-dd');

  return resource;
}
