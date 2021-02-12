import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createExtension('uuid-ossp', { ifNotExists: true });

  pgm.createTable('contacts', {
    id: { type: 'uuid', primaryKey: true, notNull: true, default: pgm.func('uuid_generate_v4()') },
    first_name: { type: 'varchar(30)', notNull: true },
    last_name: { type: 'varchar(80)', notNull: true },
    email: { type: 'varchar(120)', notNull: true },
    birth_date: { type: 'date' },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('contacts');

  pgm.dropExtension('uuid-ossp', { ifExists: true });
}
