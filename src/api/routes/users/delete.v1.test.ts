import request from 'supertest';
import { v4 } from 'uuid';
import app from '../../app';
import pool from '../../../data/pool';
import dbHelper from '../../../../test/dbHelper';
import { apiErrorResponse } from '../../../../test/apiError';

const RESOURCE_URI = '/api/v1/users/:id';

describe(`DELETE ${RESOURCE_URI}`, () => {
  const EXISTING_ID = v4();

  function act({ id = EXISTING_ID, apiKey = process.env.ALLOWED_API_KEYS } = {}) {
    const req = request(app).delete(RESOURCE_URI.replace(':id', id));

    if (apiKey) req.set('X-Api-Key', apiKey);

    return req;
  }

  beforeAll(() => dbHelper.truncateTable('contacts'));

  beforeEach(()=> dbHelper.deleteById('contacts', EXISTING_ID))

  beforeEach(() =>
    dbHelper.insert('contacts', {
      id: EXISTING_ID,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@yahoo.com',
      birth_date: new Date('1980-02-01'),
    })
  );

  afterAll(() => pool.end());

  describe('HTTP 204 (No Content)', () => {
    test('it deletes the user', async () => {
      await act().expect(204);

      const user = await dbHelper.findById('contacts', EXISTING_ID);
      expect(user).toBeUndefined();
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
    test('it returns the status if a user with the id does not exist', async () => {
      const id = v4();
      const { body } = await act({ id }).expect(404);

      expect(body).toStrictEqual({
        ...apiErrorResponse(404, 'Not Found'),
        message: `A "user" resource identified with "${id}" was not found`,
      });
    });
  });
});
