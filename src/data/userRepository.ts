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

async function update(user: User, client: DbClient = pool): Promise<void> {
  await client.query(SQL`
    UPDATE users
      SET first_name=${user.firstName},
          last_name=${user.lastName},
          email=${user.email},
          birth_date=${user.birthDate || null}
    WHERE id=${user.id}
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

async function deleteById(id: string, client: DbClient = pool): Promise<boolean> {
  const { rowCount } = await client.query(
    SQL`DELETE
        FROM users
        where id = ${id}`
  );

  return rowCount === 1;
}

export default {
  save,
  update,
  findById,
  deleteById,
};
