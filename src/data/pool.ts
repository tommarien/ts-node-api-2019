import { ClientBase, Pool } from 'pg';

export type DbClient = Pick<ClientBase, 'query'>;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.DATABASE_MAX_POOL_SIZE ? Number(process.env.DATABASE_MAX_POOL_SIZE) : undefined,
});

export default pool;
