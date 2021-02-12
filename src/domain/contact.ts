import { v4 } from 'uuid';

export default class Contact {
  birthDate?: Date;

  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public readonly id: string = v4()
  ) {}
}
