/* eslint-disable camelcase */
import SQL from '@nearform/sql';
import { v4 } from 'uuid';
import { QueryClient } from '../@types/api';
import { User } from '../@types/models';
import pool from '../services/db';

type UserDataRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date?: Date;
};

function mapToUser(row: UserDataRow): User {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    birthDate: row.birth_date,
  };
}

async function save(props: Omit<User, 'id'>, client: QueryClient = pool): Promise<User> {
  const user: User = {
    id: v4(),
    ...props,
  };

  await client.query(SQL`
    INSERT INTO users (id, first_name, last_name, email, birth_date)
    VALUES(
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
  save,
  findById,
};
