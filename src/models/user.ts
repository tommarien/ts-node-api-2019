import { v4 } from 'uuid';

export type UserProps = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: Date;
};

export default class User implements UserProps {
  firstName: string;

  lastName: string;

  email: string;

  birthDate?: Date;

  constructor(params: UserProps, public readonly id: string = v4()) {
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.email = params.email;
    this.birthDate = params.birthDate;
  }
}
