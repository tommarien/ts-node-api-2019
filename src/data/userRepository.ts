import SQL from '@nearform/sql';
import { Mapper } from '../@types/api';
import User, { UserProps } from '../models/user';
import { DbUser } from './models';
import pool, { DbClient } from './pool';

const mapToUser: Mapper<DbUser, User> = (src) =>
  new User({ firstName: src.first_name, lastName: src.last_name, email: src.email, birthDate: src.birth_date }, src.id);

async function save(props: Readonly<UserProps>, client: DbClient = pool): Promise<User> {
  const user = new User(props);

  await client.query(SQL`
    INSERT INTO users (
      id,
      first_name,
      last_name,
      email,
      birth_date
    )
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
    SQL`SELECT id, first_name, last_name, email, birth_date
        FROM users
        where id = ${id}`
  );

  if (rows.length === 0) return null;

  return mapToUser(rows[0]);
}

export default {
  save,
  findById,
};
