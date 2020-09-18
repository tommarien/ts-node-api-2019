import pino from 'pino';

import createLogger from './createLogger';

test('it creates the logger as expected', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pinoMock = (pino as unknown) as jest.Mock<any>;

  const logger = {};
  const name = 'given log name';
  pinoMock.mockReturnValue(logger);

  const result = createLogger(name);

  expect(result).toBe(logger);
  expect(pino).toHaveBeenCalledWith({
    level: 'info',
    name,
  });
});
