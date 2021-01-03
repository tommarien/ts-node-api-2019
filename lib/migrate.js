#!/usr/bin/env node
/* eslint-disable no-console */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-empty-function */
const fs = require('fs');
const kebabCase = require('lodash.kebabcase');
const path = require('path');
const Postgrator = require('postgrator');
const { promisify } = require('util');
const yargs = require('yargs');
const Yargs = require('yargs');

function nowAsUtcString() {
  const now = new Date();

  return [
    now.getUTCFullYear(),
    (now.getUTCMonth() + 1).toString().padStart(2, '0'),
    now.getUTCDate().toString().padStart(2, '0'),
    now.getUTCHours().toString().padStart(2, '0'),
    now.getUTCMinutes().toString().padStart(2, '0'),
    now.getUTCSeconds().toString().padStart(2, '0'),
  ].join('');
}

const migrationDirectory = path.join(__dirname, '../migrations');

function getPostgratorInstance(database) {
  return new Postgrator({
    migrationDirectory,
    driver: 'pg',
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    schemaTable: 'migrations',
    currentSchema: 'public',
  });
}

// eslint-disable-next-line no-unused-expressions
Yargs.options({
  db: {
    type: 'string',
    default: process.env.PGDATABASE,
    description: 'The database',
  },
})
  .command(
    'create [description]',
    'Create a new migration',
    (args) =>
      args.positional('description', {
        type: 'string',
      }),
    async (args) => {
      const timestamp = nowAsUtcString();
      const description = args.description ? kebabCase(args.description) : '';

      const writeFileAsync = promisify(fs.writeFile);

      await Promise.all([
        writeFileAsync(path.join(migrationDirectory, [timestamp, 'do', description, 'sql'].join('.')), ''),
        writeFileAsync(path.join(migrationDirectory, [timestamp, 'undo', 'sql'].join('.')), ''),
      ]);

      console.log('Migration created.');
    }
  )
  .command(
    'up',
    'Apply all pending migrations',
    () => {},
    async (args) => {
      const postgrator = getPostgratorInstance(args.db);
      const result = await postgrator.migrate();

      if (result.length === 0) {
        console.log('No migrations run for schema "public". Already at the latest one.');
      } else {
        console.log('Migration done.');
      }
    }
  )
  .command(
    'down',
    'Undo the last run migration',
    () => {},
    async (args) => {
      const postgrator = getPostgratorInstance(args.db);
      const version = await postgrator.getDatabaseVersion();

      if (version === 0) console.log('No more migrations to revert.');
      else {
        const migrations = await postgrator.getMigrations();
        const ups = migrations.filter((x) => x.action === 'do');
        let lastMigrationRun = 0;

        const indexOfDbVersion = ups.findIndex((x) => x.version === version);
        if (indexOfDbVersion > 0) lastMigrationRun = ups[indexOfDbVersion - 1].version;

        await postgrator.migrate(`${lastMigrationRun}`);

        console.log(`Reverted migration '${version}' (now @ ${lastMigrationRun}).`);
      }
    }
  )
  .command(
    'status',
    'Get the current db status',
    () => {},
    async (args) => {
      const postgrator = getPostgratorInstance(args.db);

      const maxVersion = await postgrator.getMaxVersion();

      let dbVersion = 0;

      try {
        dbVersion = await postgrator.getDatabaseVersion();
      } catch (e) {
        // no-op
      }

      if (maxVersion === dbVersion) console.log('Your db is up to date.');
      else if (dbVersion < maxVersion) console.log('Your db is behind, run migrate up.');
      else console.log('Your db seems to be ahead, did you remove an applied migration?');

      process.exit(0);
    }
  )
  .command({
    command: '*',
    handler: () => yargs.showHelp(),
  })
  .help()
  .showHelpOnFail(true).argv;
