import request from 'supertest';
import pinoMock from 'pino';
import { unauthorized } from '@hapi/boom';
import { Application } from 'express';

import app from './app';

afterEach(jest.clearAllMocks);

describe('App', () => {
  function moveLastRouteBeforeCatchAllRoute(expressApp: Application): Application {
    /* eslint-disable no-underscore-dangle */
    const lastRoute = expressApp._router.stack.pop();

    expressApp._router.stack.splice(
      expressApp._router.stack.findIndex((layer: { name: string }) => layer.name === 'catchAllRouteHandler'),
      0,
      lastRoute
    );
    /* eslint-enable no-underscore-dangle */

    return expressApp;
  }

  test('it returns status 404 for any unmatched route', async () => {
    const { body } = await request(app)
      .get('/unknown')
      .expect(404);

    expect(body).toStrictEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  test('it keeps boomified errors', async () => {
    app.get('/http-error', () => {
      throw unauthorized(null, 'basic');
    });

    // it keeps the status
    const { body, header } = await request(moveLastRouteBeforeCatchAllRoute(app))
      .get('/http-error')
      .expect(401);

    // it outputs the correct info
    expect(body).toStrictEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
    });

    // it adds the headers
    expect(header).toHaveProperty('www-authenticate', 'basic');

    // ensure it does not call log the error
    expect(pinoMock().error).not.toHaveBeenCalled();
  });

  test('it returns status 500 for any uncatched error', async () => {
    app.get('/uncatched-error', () => {
      throw new Error('Something obscure happened');
    });

    // it wraps it in a status 500
    const { body } = await request(moveLastRouteBeforeCatchAllRoute(app))
      .get('/uncatched-error')
      .expect(500);

    // it outputs the correct info
    expect(body).toStrictEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
    });

    // it logs the error to our error logging
    expect(pinoMock().error).toHaveBeenCalledWith(
      expect.objectContaining({
        err: new Error('Something obscure happened'),
        req: expect.objectContaining({ originalUrl: '/uncatched-error' }),
      }),
      'Server error occurred'
    );
  });

  test('ensure it logs the error if headers were already sent', async () => {
    app.get('/headers-sent', (req, res) => {
      res.send({});
      throw new Error('After headers sent');
    });

    // it does not change the status
    await request(moveLastRouteBeforeCatchAllRoute(app))
      .get('/headers-sent')
      .expect(200);

    // it logs the error to our error logging
    expect(pinoMock().error).toHaveBeenCalledWith(
      expect.objectContaining({
        err: new Error('After headers sent'),
        req: expect.objectContaining({ originalUrl: '/headers-sent' }),
        res: expect.objectContaining({ statusCode: 200 }),
      }),
      'Error occurred but headers already sent'
    );
  });
});
