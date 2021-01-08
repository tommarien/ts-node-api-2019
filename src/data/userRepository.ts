import SQL from '@nearform/sql';
import { v4 } from 'uuid';
import { User } from '../@types/models';
import { DbUser } from './models';
import pool, { DbClient } from './pool';

function mapToUser(row: DbUser): User {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    birthDate: row.birth_date,
  };
}

async function save(props: Omit<User, 'id'>, client: DbClient = pool): Promise<User> {
  const user: User = {
    id: v4(),
    ...props,
  };

  await client.query(SQL`
    INSERT INTO users (id, first_name, last_name, email, birth_date)
    VALUES (
      ${user.id},
      ${user.firstName},
      ${user.lastName},
      ${user.email},
      ${user.birthDate || null}
    )
  `);

  return user;
}

async function findById(id: string, client: DbClient = pool): Promise<User | null> {
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
