// Environment
process.env.PORT = 3000;
process.env.LOG_LEVEL = 'silent';
process.env.RUNTIME_ENV = 'local';
process.env.ALLOWED_API_KEYS = '28acfff0-fbb9-4153-9353-59dca33e727d';

if (!process.env.PGHOST) process.env.PGHOST = 'localhost';
if (!process.env.PGUSER) process.env.PGUSER = 'node-api';
if (!process.env.PGDATABASE) process.env.PGDATABASE = 'ts-node-api-test';
if (!process.env.PGPASSWORD) process.env.PGPASSWORD = 'letmein';
