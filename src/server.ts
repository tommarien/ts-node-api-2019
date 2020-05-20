import app from './app';
import createLogger from './utils/createLogger';

const logger = createLogger('server');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Listening on port:${port}`);
});
