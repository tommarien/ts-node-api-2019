import { UserRequestBodyV1 } from '../schemas/types/user.request.body.v1';

declare namespace Resources {
  interface UserResource extends UserRequestBodyV1 {
    id: string;
  }
}

export = Resources;
