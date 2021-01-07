import { UserRequestBodyV1 } from '../schemas/types/user.request.body.v1';

export interface UserResource extends UserRequestBodyV1 {
  id: string;
}
