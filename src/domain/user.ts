/* eslint-disable max-classes-per-file */
import { v4 } from 'uuid';

export default class User {
  birthDate?: Date;

  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public readonly id: string = v4()
  ) {}
}
