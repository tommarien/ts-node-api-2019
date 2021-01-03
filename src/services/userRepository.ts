/* eslint-disable camelcase */
import SQL from '@nearform/sql';
import { ClientBase } from 'pg';
import { v4 } from 'uuid';
import pool from './db';

type UserRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date?: Date;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: Date;
};

type QueryClient = Pick<ClientBase, 'query'>;

function mapToUser(row: UserRow): User {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    birthDate: row.birth_date,
  };
}

async function create(props: Omit<User, 'id'>, client: QueryClient = pool): Promise<User> {
  const user: User = {
    id: v4(),
    ...props,
  };

  await client.query(SQL`
    INSERT INTO users(id, first_name, last_name, email, birth_date) VALUES(
      ${user.id},
      ${user.firstName},
      ${user.lastName},
      ${user.email},
      ${user.birthDate || null}
    )
  `);

  return user;
}

async function findById(id: string, client: QueryClient = pool): Promise<User | null> {
  const { rows } = await client.query(
    SQL`select id, first_name, last_name, email, birth_date from users where id = ${id}`
  );

  if (rows.length === 0) return null;

  return mapToUser(rows[0]);
}

export default {
  create,
  findById,
};
