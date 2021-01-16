import { v4 } from 'uuid';
import { Optional } from '../@types/api';

type UserAttributes = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: Date;
};

export default class User implements UserAttributes {
  readonly id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: Date;

  constructor({ id = v4(), firstName, lastName, email, birthDate }: Optional<UserAttributes, 'id'>) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.birthDate = birthDate;
  }
}
