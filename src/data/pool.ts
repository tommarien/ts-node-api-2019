import { ClientBase, Pool } from 'pg';

export type DbClient = Pick<ClientBase, 'query'>;

const pool = new Pool({
  max: process.env.PGMAXPOOLSIZE ? Number(process.env.PGMAXPOOLSIZE) : undefined,
});

export default pool;
