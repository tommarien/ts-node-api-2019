import pino from 'pino';

import createLogger from './createLogger';

test('it creates the logger as expected', () => {
  const pinoMock = (pino as unknown) as jest.Mock<any>;

  const logger = {};
  const name = 'given log name';
  pinoMock.mockReturnValue(logger);

  const result = createLogger(name);

  expect(result).toBe(logger);
  expect(pino).toHaveBeenCalledWith({
    level: process.env.LOG_LEVEL,
    name,
    prettyPrint: {
      ignore: 'pid,hostname',
      levelFirst: true,
      translateTime: true,
    },
    serializers: {}, // * Coming from pino automock
  });
});
