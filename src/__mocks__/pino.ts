export const error = jest.fn();

const pino = jest.fn().mockImplementation(() => ({
  error,
}));

export default pino;
