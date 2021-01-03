import pool from '../services/db';

type KnownTable = 'users';

async function truncateTable(tableName: KnownTable): Promise<void> {
  await pool.query(`TRUNCATE TABLE ${tableName}`);
}

async function findById(tableName: KnownTable, id: unknown): Promise<Record<string, unknown>> {
  // eslint-disable-next-line sql/no-unsafe-query
  const { rowCount, rows } = await pool.query({ text: `SELECT * FROM ${tableName} WHERE id=$1`, values: [id] });
  if (rowCount > 1) throw new Error(`More than one result by id for table '${tableName}'`);
  return rows[0];
}

export default {
  truncateTable,
  findById,
};
