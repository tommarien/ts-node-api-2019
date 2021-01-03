# Migrations

## Creating a new migration

```sh
yarn migrate create 'name of the new migration'
```

This will create a new migration according to the timestamp.(do/undo).name-of-the-new-migration.sql

## Checking if you have already executed all migrations

```sh
yarn migrate status [--db=database]
```

Sample output:

```sh
Your db is up to date.
```

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
