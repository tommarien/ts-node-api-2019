/* eslint-disable sql/no-unsafe-query */
import { ContactRecord } from '../src/data/models';
import pool from '../src/data/pool';

type KnownTable = 'contacts';

async function truncateTable(tableName: KnownTable): Promise<void> {
  await pool.query(`TRUNCATE TABLE ${tableName}`);
}

async function findById(tableName: KnownTable, id: unknown): Promise<Record<string, unknown>> {
  const { rowCount, rows } = await pool.query(`SELECT * FROM ${tableName} WHERE id=$1`, [id]);

  if (rowCount > 1) throw new Error(`More than one result by id for table '${tableName}'`);

  return rows[0];
}

function insert(tableName: 'contacts', row: ContactRecord): Promise<void>;
async function insert(tableName: KnownTable, row: Record<string, unknown>): Promise<void> {
  const columns = Object.keys(row);
  const values = Object.values(row).map((v) => (v === undefined ? null : v));

  const sql = `INSERT INTO ${tableName} (${columns}) \nVALUES (${columns.map((_, idx) => `$${idx + 1}`)})`;

  await pool.query(sql, values);
}

async function deleteById(tableName: KnownTable, id: unknown): Promise<void> {
  await pool.query(`DELETE FROM ${tableName} WHERE id=$1`, [id]);
}

export default {
  truncateTable,
  findById,
  insert,
  deleteById,
};
