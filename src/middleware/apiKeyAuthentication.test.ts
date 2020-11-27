import express, { Application, RequestHandler } from 'express';
import request from 'supertest';
import apiKeyAuth from './apiKeyAuthentication';

const API_KEY_HEADER = 'X-Api-Key';

describe('apiAuthenticationMiddleware', () => {
  function createApplication(): Application {
    const app = express();

    app.use(apiKeyAuth);

    const echoApiKeyHandler: RequestHandler = (req, res) => {
      res.send({ apiKey: req.apiKey });
    };

    app.route('/secure').get(echoApiKeyHandler);

    return app;
  }

  test('it returns returns successful status if header present and valid', async () => {
    const app = createApplication();

    const { body } = await request(app)
      .get('/secure')
      .set(API_KEY_HEADER, process.env.ALLOWED_API_KEYS as string)
      .expect(200);

    expect(body).toEqual({
      apiKey: process.env.ALLOWED_API_KEYS,
    });
  });

  test('it returns status 401 if no header present', async () => {
    const app = createApplication();

    const { body } = await request(app).get('/secure').expect(401);

    expect(body).toEqual({
      error: 'Unauthorized',
      message: 'No Api key specified (X-API-Key header)',
      statusCode: 401,
    });
  });

  test('it returns status 401 if unknown api key', async () => {
    const app = createApplication();

    const { body } = await request(app).get('/secure').set(API_KEY_HEADER, 'another-api-key').expect(401);

    expect(body).toEqual({
      error: 'Unauthorized',
      message: 'The API key provided is invalid',
      statusCode: 401,
    });
  });
});
