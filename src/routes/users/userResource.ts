import { format } from 'date-fns';
import { UserResourceV1 } from '../../schemas/types/user.resource.v1';
import { User } from '../../services/userRepository';

export type UserResponseV1 = UserResourceV1 & {
  id: string;
};

export function mapToResource(user: User): UserResponseV1 {
  const { birthDate, ...rest } = user;

  const resource: UserResponseV1 = {
    ...rest,
  };

  if (birthDate) resource.birthDate = format(birthDate, 'yyyy-MM-dd');

  return resource;
}
