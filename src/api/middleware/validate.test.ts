import express, { RequestHandler } from 'express';
import request from 'supertest';
import validate from './validate';

describe('validation middleware', () => {
  describe('params', () => {
    const app = express();

    const echoParams: RequestHandler = (req, res) => {
      const { params } = req;

      res.status(200).send(params);
    };

    const paramsSchema = {
      type: 'object',
      properties: {
        page: { type: 'number' },
      },
      required: ['page'],
      additionalProperties: false,
    };

    beforeAll(() => {
      app.route('/list/:page').get(validate({ params: paramsSchema }), echoParams);
    });

    function act(page: string) {
      return request(app).get('/list/:page'.replace(':page', page));
    }

    test('it coerces types', async () => {
      const { body } = await act('1').expect(200);

      expect(body).toStrictEqual({
        page: 1,
      });
    });

    test('it returns 400 Bad Request when something is invalid', async () => {
      const { body } = await act('true').expect(400);

      expect(body).toStrictEqual({
        error: 'Bad Request',
        message: 'Request validation failed: params.page should be number',
        statusCode: 400,
      });
    });
  });

  describe('body', () => {
    const app = express();

    const echoBody: RequestHandler = (req, res) => {
      const { body } = req;

      res.status(200).send(body);
    };

    app.use(express.json());

    const bodySchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        active: { type: 'boolean', default: false },
        birthDate: { type: 'string', format: 'date' },
      },
      required: ['name'],
      additionalProperties: false,
    };

    beforeAll(() => {
      app.route('/create').post(validate({ body: bodySchema }), echoBody);
    });

    function act(data: Record<string, unknown>) {
      return request(app).post('/create').send(data);
    }

    test('it removes additional properties', async () => {
      const { body } = await act({ name: 'Tom', active: true, isRemoved: 'alpha' }).expect(200);

      expect(body).toStrictEqual({
        active: true,
        name: 'Tom',
      });
    });

    test('it coerces types', async () => {
      const { body } = await act({ name: 'Tom', active: 'true' }).expect(200);

      expect(body).toStrictEqual({
        active: true,
        name: 'Tom',
      });
    });

    test('it applies defaults', async () => {
      const { body } = await act({ name: 'Tom' }).expect(200);

      expect(body).toStrictEqual({
        active: false,
        name: 'Tom',
      });
    });

    test('it blocks invalid dates (see if format is full)', async () => {
      const { body } = await act({ name: 'Tom', birthDate: '2021-11-31' }).expect(400);

      expect(body).toStrictEqual({
        error: 'Bad Request',
        message: 'Request validation failed: body.birthDate should match format "date"',
        statusCode: 400,
      });
    });

    test('it returns 400 Bad Request when something is invalid', async () => {
      const { body } = await act({}).expect(400);

      expect(body).toStrictEqual({
        error: 'Bad Request',
        message: "Request validation failed: body should have required property 'name'",
        statusCode: 400,
      });
    });
  });

  describe('query', () => {
    const app = express();

    const echoQuery: RequestHandler = (req, res) => {
      const { query } = req;

      res.status(200).send(query);
    };

    const querySchema = {
      type: 'object',
      properties: {
        page: { type: 'number' },
        pageSize: { type: 'number', default: 10 },
        search: { type: 'string' },
      },
      required: ['page'],
      additionalProperties: false,
    };

    beforeAll(() => {
      app.route('/query').get(validate({ query: querySchema }), echoQuery);
    });

    function act(query: Record<string, unknown>) {
      return request(app).get('/query').query(query);
    }

    test('it removes additional properties', async () => {
      const { body } = await act({ page: 1, pageSize: 5, ignored: 'alpha' }).expect(200);

      expect(body).toStrictEqual({
        page: 1,
        pageSize: 5,
      });
    });

    test('it coerces types', async () => {
      const { body } = await act({ page: '1', pageSize: 5 }).expect(200);

      expect(body).toStrictEqual({
        page: 1,
        pageSize: 5,
      });
    });

    test('it applies defaults', async () => {
      const { body } = await act({ page: 1 }).expect(200);

      expect(body).toStrictEqual({
        page: 1,
        pageSize: 10,
      });
    });

    test('it returns 400 Bad Request when something is invalid', async () => {
      const { body } = await act({}).expect(400);

      expect(body).toStrictEqual({
        error: 'Bad Request',
        message: "Request validation failed: query should have required property 'page'",
        statusCode: 400,
      });
    });
  });
});
