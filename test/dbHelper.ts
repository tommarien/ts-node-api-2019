import { DbUser } from '../src/data/models';
import pool from '../src/data/pool';

type KnownTable = 'contacts';

async function truncateTable(tableName: KnownTable): Promise<void> {
  await pool.query(`TRUNCATE TABLE ${tableName}`);
}

async function findById(tableName: KnownTable, id: unknown): Promise<Record<string, unknown>> {
  // eslint-disable-next-line sql/no-unsafe-query
  const { rowCount, rows } = await pool.query(`SELECT * FROM ${tableName} WHERE id=$1`, [id]);
  if (rowCount > 1) throw new Error(`More than one result by id for table '${tableName}'`);
  return rows[0];
}

function insert(tableName: 'contacts', row: DbUser): Promise<void>;
async function insert(tableName: KnownTable, row: Record<string, unknown>): Promise<void> {
  const columns = Object.keys(row);
  const values = Object.values(row).map((v) => (v === undefined ? null : v));

  // eslint-disable-next-line sql/no-unsafe-query
  const sql = `INSERT INTO ${tableName} (${columns}) \nVALUES (${columns.map((_, idx) => `$${idx + 1}`)})`;

  await pool.query(sql, values);
}

async function deleteById(tableName: KnownTable, id: unknown): Promise<void> {
  // eslint-disable-next-line sql/no-unsafe-query
  await pool.query(`DELETE FROM ${tableName} WHERE id=$1`, [id]);
}

export default {
  truncateTable,
  findById,
  insert,
  deleteById,
};
