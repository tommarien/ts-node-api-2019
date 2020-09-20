import pino, { Logger } from 'pino';

export default function loggerFactory(name?: string): Logger {
  return pino({
    name,
    level: process.env.LOG_LEVEL,
  });
}
