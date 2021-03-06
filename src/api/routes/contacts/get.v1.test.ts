import request from 'supertest';
import { v4 } from 'uuid';
import { apiErrorResponse } from '../../../../test/apiError';
import dbHelper from '../../../../test/dbHelper';
import pool from '../../../data/pool';
import app from '../../app';

const RESOURCE_URI = '/api/v1/contacts/:id';

describe(`GET ${RESOURCE_URI}`, () => {
  const EXISTING_ID = v4();

  function act({ id = EXISTING_ID, apiKey = process.env.ALLOWED_API_KEYS } = {}) {
    const req = request(app).get(RESOURCE_URI.replace(':id', id));

    if (apiKey) req.set('X-Api-Key', apiKey);

    return req;
  }

  beforeAll(() => dbHelper.truncateTable('contacts'));

  beforeAll(() =>
    dbHelper.insert('contacts', {
      id: EXISTING_ID,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@yahoo.com',
      birth_date: new Date('1980-02-01'),
    })
  );

  afterAll(() => pool.end());

  describe('HTTP 200 (OK)', () => {
    test('it returns the contact', async () => {
      const { body } = await act().expect(200);

      expect(body).toStrictEqual({
        id: EXISTING_ID,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@yahoo.com',
        birthDate: '1980-02-01',
      });
    });
  });

  describe('HTTP 400 (Bad Request)', () => {
    describe('id (param)', () => {
      test('it returns the status if not an uuid', async () => {
        const { body } = await act({ id: 'id' }).expect(400);

        expect(body).toStrictEqual({
          ...apiErrorResponse(400, 'Bad Request'),
          message: 'Request validation failed: params.id should match format "uuid"',
        });
      });
    });
  });

  describe('HTTP 401 (Unauthorized)', () => {
    test('it returns the status if the api key is missing', async () => {
      const { body } = await act({ apiKey: '' }).expect(401);

      expect(body).toStrictEqual({
        ...apiErrorResponse(401, 'Unauthorized'),
        message: 'No Api key specified (X-API-Key header)',
      });
    });
  });

  describe('HTTP 404 (Not Found)', () => {
    test('it returns the status if a contact with the id does not exist', async () => {
      const id = v4();
      const { body } = await act({ id }).expect(404);

      expect(body).toStrictEqual({
        ...apiErrorResponse(404, 'Not Found'),
        message: `A "contact" resource identified with "${id}" was not found`,
      });
    });
  });
});
