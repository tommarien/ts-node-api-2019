const mockLogger = {
  fatal: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
};

const pino = jest.fn().mockImplementation(() => mockLogger);

export default pino;
