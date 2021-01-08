import pino, { Logger } from 'pino';
import { mocked } from 'ts-jest/utils';
import loggerFactory from './loggerFactory';

jest.mock('pino');

const pinoMock = mocked(pino);

test('it creates the logger as expected', () => {
  const loggerMock = {} as Logger;
  pinoMock.mockImplementation(() => loggerMock);

  const name = 'given log name';

  const logger = loggerFactory(name);

  expect(pino).toHaveBeenCalledWith({
    name,
    level: 'silent',
  });

  expect(logger).toBe(loggerMock);
});
