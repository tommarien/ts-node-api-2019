# Migrations

## Creating a new migration

```sh
yarn migrate create 'name of the new migration'
```

This will create a new migration according to the timestamp-name_of_the_new_migration.js

Example migration that will be auto-generated for you:

```js
module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
```

## Checking if you have already executed all migrations

```sh
yarn migrate status
```

Sample output:

```sh
┌──────────────────────────────────────────────┬────────────┐
│ Filename                                     │ Applied At │
├──────────────────────────────────────────────┼────────────┤
│ 20171031130724-drop_migrations_collection.js │ PENDING    │
└──────────────────────────────────────────────┴────────────┘
```

In the applied at column you will directly see if the migration has been applied or is still pending

## Applying all pending migrations

```sh
yarn migrate up
```

## Downing the last migration

```sh
yarn migrate down
```

## More info

See https://github.com/seppevs/migrate-mongo/blob/master/README.md for more info.
