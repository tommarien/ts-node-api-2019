import app from './app';
import loggerFactory from './utils/loggerFactory';

const logger = loggerFactory('server');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Listening on port:${port}`);
});
