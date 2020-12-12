import { mocked } from 'ts-jest/utils';
import { Router } from 'express';
import { v4 } from 'uuid';
import request from 'supertest';
import { unauthorized } from '@hapi/boom';

import apiRouter from './routes/apiRouter';
import app from './app';
import loggerFactory from './utils/loggerFactory';

jest.mock('./utils/loggerFactory', () => {
  const logger = { error: jest.fn(), warn: jest.fn() };

  return () => logger;
});

jest.mock('uuid');
jest.mock('./routes/apiRouter');

const apiRouterMock = mocked(apiRouter);
const uuIdV4Mock = mocked(v4);

class ServiceUnavailableHttpError extends Error {
  statusCode: number;

  constructor(message?: string) {
    super(message); // 'Error' breaks prototype chain here
    this.statusCode = 503;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

describe('App', () => {
  function createRouter(): Router {
    const router = Router();

    router.get('/echo-req-id', (req, res) => {
      res.send({ reqId: req.id });
    });

    router.get('/http-error', () => {
      throw unauthorized(null, 'basic');
    });

    router.get('/error-with-status-code', () => {
      throw new ServiceUnavailableHttpError('TimedOut');
    });

    router.get('/uncatched-error', () => {
      throw new Error('Something obscure happened');
    });

    router.get('/headers-sent', (_req, res) => {
      res.send({});
      throw new Error('After headers sent');
    });

    router.get('/echo-protocol', (req, res) => {
      res.send({ protocol: req.protocol });
    });

    return router;
  }

  beforeEach(() => {
    uuIdV4Mock.mockReturnValue('5dd72048-9059-4644-a4d6-07cda670264b');
    apiRouterMock.mockImplementation(createRouter());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('it thrusts X-Forwarded-Proto header', async () => {
    const protocol = 'https';

    const { body } = await request(app).get('/api/echo-protocol').set('X-Forwarded-Proto', protocol).expect(200);

    expect(body).toEqual({ protocol });
  });

  describe('requestId middleware', () => {
    describe('no X-Request-Id header present', () => {
      test('it generates a request id if none in header', async () => {
        const { body } = await request(app).get('/api/echo-req-id').expect(200);

        expect(body).toEqual({
          reqId: '5dd72048-9059-4644-a4d6-07cda670264b',
        });

        expect(uuIdV4Mock).toHaveBeenCalledTimes(1);
      });

      test('it adds the X-Request-Id to the response', async () => {
        const { header } = await request(app).get('/api/echo-req-id').expect(200);

        expect(header).toEqual(
          expect.objectContaining({
            'x-request-id': '5dd72048-9059-4644-a4d6-07cda670264b',
          })
        );
      });
    });

    describe('X-Request-Id header present', () => {
      test('it adds the value from X-Request-Id header to the request', async () => {
        const requestId = 'some-external-id';

        const { body } = await request(app).get('/api/echo-req-id').set('X-Request-Id', requestId).expect(200);

        expect(body).toEqual({
          reqId: requestId,
        });

        expect(uuIdV4Mock).not.toHaveBeenCalled();
      });

      test('it echoes it back into the response', async () => {
        const requestId = 'some-external-id';
        const { header } = await request(app).get('/api/echo-req-id').set('X-Request-Id', requestId).expect(200);

        expect(header).toEqual(
          expect.objectContaining({
            'x-request-id': requestId,
          })
        );
      });
    });
  });

  describe('unknown routes', () => {
    test('it returns status 404 for any unmatched route', async () => {
      const { body } = await request(app).get('/api/unknown').expect(404);

      expect(body).toStrictEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Not Found',
      });
    });
  });

  describe('error handling', () => {
    test('it keeps boomified errors', async () => {
      const loggerMock = loggerFactory();

      // it keeps the status
      const { body, header } = await request(app).get('/api/http-error').expect(401);

      // it outputs the correct info
      expect(body).toStrictEqual({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Unauthorized',
      });

      // it adds the headers
      expect(header).toHaveProperty('www-authenticate', 'basic');

      // ensure it does not call log the error
      expect(loggerMock.error).not.toHaveBeenCalled();
    });

    test('it retains statusCode from errors that have one', async () => {
      // it keeps the status
      const { body } = await request(app).get('/api/error-with-status-code').expect(503);

      // it outputs the correct info
      expect(body).toStrictEqual({
        statusCode: 503,
        error: 'Service Unavailable',
        message: 'TimedOut',
      });
    });

    test('it returns status 500 for any uncatched error', async () => {
      const loggerMock = loggerFactory();

      // it wraps it in a status 500
      const { body } = await request(app).get('/api/uncatched-error').expect(500);

      // it outputs the correct info
      expect(body).toStrictEqual({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred',
      });

      // it logs the error to our error logging
      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.objectContaining({
          err: new Error('Something obscure happened'),
          req: expect.objectContaining({ originalUrl: '/api/uncatched-error' }),
        }),
        'server error occurred'
      );
    });

    test('ensure it logs the error if headers were already sent', async () => {
      const loggerMock = loggerFactory();

      // it does not change the status
      await request(app).get('/api/headers-sent').expect(200);

      // it logs the error to our error logging
      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.objectContaining({
          err: new Error('After headers sent'),
          req: expect.objectContaining({ originalUrl: '/api/headers-sent' }),
          res: expect.objectContaining({ statusCode: 200 }),
        }),
        'error occurred but headers already sent'
      );
    });
  });
});
