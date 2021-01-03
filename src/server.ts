import { createHttpTerminator } from 'http-terminator';

import app from './app';
import pool from './services/db';
import loggerFactory from './utils/loggerFactory';

const PORT = process.env.PORT || 3000;
const logger = loggerFactory('server');

const server = app.listen(PORT, () => {
  logger.info(`ready and listening on port ${PORT}`);
});

if (process.env.GRACEFUL_SHUTDOWN === 'true') {
  const httpTerminator = createHttpTerminator({ server });

  process.on('SIGTERM', () => {
    logger.info('server is shutting down...');

    httpTerminator //
      .terminate()
      .then(() => pool.end())
      .then(() => {
        logger.info('gracefully exited');
        process.exit(0);
      })
      .catch((err) => {
        logger.error('something went wrong during graceful shutdown', err);
        process.exit(1);
      });
  });
}
