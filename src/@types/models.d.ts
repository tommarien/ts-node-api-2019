declare namespace Models {
  export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate?: Date;
  };
}

export = Models;
