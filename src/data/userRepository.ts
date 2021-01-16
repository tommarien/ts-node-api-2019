import SQL from '@nearform/sql';
import { Mapper } from '../@types/api';
import User from '../domain/user';
import { DbUser } from './models';
import pool, { DbClient } from './pool';

const mapToUser: Mapper<DbUser, User> = ({
  id,
  first_name: firstName,
  last_name: lastName,
  email,
  birth_date: birthDate,
}) => {
  const user = new User(firstName, lastName, email, id);
  user.birthDate = birthDate;

  return user;
};

async function save(user: User, client: DbClient = pool): Promise<void> {
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
