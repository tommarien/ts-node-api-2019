import { Pool } from 'pg';

const pool = new Pool({
  max: process.env.PGMAXPOOLSIZE ? Number(process.env.PGMAXPOOLSIZE) : undefined,
});

export default pool;
