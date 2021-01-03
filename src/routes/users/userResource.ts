import { format } from 'date-fns';
import { UserRequestBodyV1 } from '../../schemas/types/user.request.body.v1';
import { User } from '../../services/userRepository';

export type UserResource = UserRequestBodyV1 & {
  id: string;
};

export function mapToResource(user: User): UserResource {
  const { birthDate, ...rest } = user;

  const resource: UserResource = {
    ...rest,
  };

  if (birthDate) resource.birthDate = format(birthDate, 'yyyy-MM-dd');

  return resource;
}
