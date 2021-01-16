import { format } from 'date-fns';
import { Mapper } from '../../../@types/api';
import User from '../../../domain/user';
import { UserRequestBodyV1 } from '../../schemas/types/user.request.body.v1';

export interface UserResource extends UserRequestBodyV1 {
  id: string;
}

export const userToResourceMapper: Mapper<User, UserResource> = (src) => {
  const { birthDate, ...rest } = src;

  const resource: UserResource = {
    ...rest,
  };

  if (birthDate) resource.birthDate = format(birthDate, 'yyyy-MM-dd');

  return resource;
};
