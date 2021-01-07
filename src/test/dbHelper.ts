import pool from '../services/db';

type KnownTable = 'users';

async function truncateTable(tableName: KnownTable): Promise<void> {
  await pool.query(`TRUNCATE TABLE ${tableName}`);
}

async function findById(tableName: KnownTable, id: unknown): Promise<Record<string, unknown>> {
  // eslint-disable-next-line sql/no-unsafe-query
  const { rowCount, rows } = await pool.query(`SELECT * FROM ${tableName} WHERE id=$1`, [id]);
  if (rowCount > 1) throw new Error(`More than one result by id for table '${tableName}'`);
  return rows[0];
}

async function insert(tableName: KnownTable, row: Record<string, unknown>): Promise<void> {
  const columns = Object.keys(row);
  const values = Object.values(row).map((v) => (v === undefined ? null : v));

  // eslint-disable-next-line sql/no-unsafe-query
  const sql = `INSERT INTO ${tableName} (${columns}) \nVALUES (${columns.map((_, idx) => `$${idx + 1}`)})`;

  await pool.query(sql, values);
}

export default {
  truncateTable,
  findById,
  insert,
};
