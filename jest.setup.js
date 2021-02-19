// Environment
process.env.PORT = 3000;
process.env.LOG_LEVEL = 'silent';
process.env.RUNTIME_ENV = 'local';
process.env.ALLOWED_API_KEYS = '28acfff0-fbb9-4153-9353-59dca33e727d';

process.env.GRACEFUL_SHUTDOWN = 'false';
process.env.ENFORCE_HTTPS = 'false';
process.env.EXPOSE_API_DOCS = 'false';

process.env.DATABASE_URL = process.env.DATABASE_TEST_URL;
