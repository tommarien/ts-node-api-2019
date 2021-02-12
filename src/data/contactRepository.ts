import SQL from '@nearform/sql';
import { Mapper } from '../@types/api';
import Contact from '../domain/contact';
import { ContactRecord } from './models';
import pool, { DbClient } from './pool';

const map: Mapper<ContactRecord, Contact> = ({
  id,
  first_name: firstName,
  last_name: lastName,
  email,
  birth_date: birthDate,
}) => {
  const contact = new Contact(firstName, lastName, email, id);
  contact.birthDate = birthDate;

  return contact;
};

export class ContactRepository {
  constructor(private client: DbClient = pool) {}

  async findById(id: string): Promise<Contact | null> {
    const { rows } = await this.client.query(
      SQL`SELECT id, first_name, last_name, email, birth_date
          FROM contacts
          where id = ${id}`
    );

    if (rows.length === 0) return null;

    return map(rows[0]);
  }

  async add(contact: Contact): Promise<void> {
    await this.client.query(SQL`
      INSERT INTO contacts (
        id,
        first_name,
        last_name,
        email,
        birth_date
      )
      VALUES (
        ${contact.id},
        ${contact.firstName},
        ${contact.lastName},
        ${contact.email},
        ${contact.birthDate || null}
      )
    `);
  }

  async update(contact: Contact): Promise<boolean> {
    const { rowCount } = await this.client.query(SQL`
      UPDATE contacts
        SET first_name=${contact.firstName},
            last_name=${contact.lastName},
            email=${contact.email},
            birth_date=${contact.birthDate || null}
      WHERE id=${contact.id}
    `);

    return rowCount === 1;
  }

  async removeById(id: string): Promise<boolean> {
    const { rowCount } = await this.client.query(
      SQL`DELETE
          FROM contacts
          where id = ${id}`
    );

    return rowCount === 1;
  }
}

export default new ContactRepository();
