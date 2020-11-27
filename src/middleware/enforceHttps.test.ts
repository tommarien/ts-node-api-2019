import express, { Application, RequestHandler } from 'express';
import request from 'supertest';
import enforceHttps from './enforceHttps';

describe('enforce Https middleware', () => {
  function createApplication(): Application {
    const app = express();

    app.set('trust proxy', true);

    app.use(enforceHttps);

    const sendNoContentStatusHandler: RequestHandler = (_req, res) => {
      res.sendStatus(204);
    };

    app
      .route('/secure')
      .head(sendNoContentStatusHandler)
      .get(sendNoContentStatusHandler)
      .post(sendNoContentStatusHandler);

    return app;
  }

  test('it redirects (301) to https if method === GET', async () => {
    const app = createApplication();

    const { header } = await request(app).get('/secure').expect(301);

    expect(header).toHaveProperty('location', 'https://127.0.0.1/secure');
  });

  test('it redirects (301) to https if method === HEAD', async () => {
    const app = createApplication();

    const { header } = await request(app).head('/secure').expect(301);

    expect(header).toHaveProperty('location', 'https://127.0.0.1/secure');
  });

  // eslint-disable-next-line jest/expect-expect
  test('guard it does not redirect if already secure', async () => {
    const app = createApplication();

    await request(app).get('/secure').set('X-Forwarded-Proto', 'https').expect(204);
  });

  test('it returns status 403 if http method !== GET | HEAD', async () => {
    const app = createApplication();

    const { body } = await request(app).post('/secure').expect(403);

    expect(body).toEqual({
      error: 'Forbidden',
      message: 'SSL Required',
      statusCode: 403,
    });
  });
});
