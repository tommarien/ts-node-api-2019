import pino, { Logger, stdSerializers } from 'pino';

export default function createLogger(name?: string): Logger {
  return pino({
    name,
    prettyPrint: {
      levelFirst: true,
      ignore: 'pid,hostname',
      translateTime: true,
    },
    serializers: stdSerializers,
    level: process.env.LOG_LEVEL,
  });
}
