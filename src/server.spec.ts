import app from './app';

jest.mock('./app');

describe('Server', () => {
  test('it starts listening on the configured port', async () => {
    await import('./server');

    expect(app.listen).toHaveBeenCalledWith('3000', expect.any(Function));
  });
});
