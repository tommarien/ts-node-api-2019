import request from 'supertest';
import { v4 } from 'uuid';
import { parse } from 'date-fns';
import app from '../../app';
import pool from '../../../data/pool';
import dbHelper from '../../../../test/dbHelper';
import { apiErrorResponse } from '../../../../test/apiError';

const RESOURCE_URI = '/api/v1/users/:id';

type Body = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
};

describe(`PUT ${RESOURCE_URI}`, () => {
  const EXISTING_ID = v4();

  function buildValidBody(): Partial<Body> {
    return {
      firstName: 'Sarah',
      lastName: 'Conner',
      email: 'sarah.conner@yahoo.com',
    };
  }

  function act({ id = EXISTING_ID, data = buildValidBody(), apiKey = process.env.ALLOWED_API_KEYS } = {}) {
    const req = request(app).put(RESOURCE_URI.replace(':id', id)).send(data);

    if (apiKey) req.set('X-Api-Key', apiKey);

    return req;
  }

  beforeEach(() => dbHelper.truncateTable('users'));

  beforeEach(() =>
    dbHelper.insert('users', {
      id: EXISTING_ID,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@yahoo.com',
    })
  );

  afterAll(() => pool.end());

  describe('HTTP 200 (OK)', () => {
    test('it returns the status and updates the user with minimum props', async () => {
      const user = buildValidBody();

      const { body } = await act({ data: user }).expect(200);

      expect(body).toStrictEqual({
        id: EXISTING_ID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

      const row = await dbHelper.findById('users', EXISTING_ID);

      expect(row).toStrictEqual({
        id: EXISTING_ID,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        birth_date: null,
      });
    });

    test('it returns the status and updates the user with all props', async () => {
      const user = { ...buildValidBody(), birthDate: '1980-09-15' };

      const { body } = await act({ data: user }).expect(200);

      expect(body).toStrictEqual({
        id: EXISTING_ID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
      });

      const row = await dbHelper.findById('users', EXISTING_ID);

      expect(row).toStrictEqual({
        id: body.id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        birth_date: parse(user.birthDate, 'yyyy-MM-dd', new Date()),
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

    describe('firstName', () => {
      test('it returns the status if not given', async () => {
        const { firstName, ...rest } = buildValidBody();

        const { body } = await act({ data: { ...rest } }).expect(400);

        expect(body).toStrictEqual({
          ...apiErrorResponse(400, 'Bad Request'),
          message: "Request validation failed: body should have required property 'firstName'",
        });
      });

      test('it returns the status if longer than 30 chars', async () => {
        const { body } = await act({ data: { ...buildValidBody(), firstName: 'a'.repeat(31) } }).expect(400);

        expect(body).toStrictEqual({
          ...apiErrorResponse(400, 'Bad Request'),
          message: 'Request validation failed: body.firstName should NOT be longer than 30 characters',
        });
      });
    });

    describe('lastName', () => {
      test('it returns the status if not given', async () => {
        const { lastName, ...rest } = buildValidBody();

        const { body } = await act({ data: { ...rest } }).expect(400);

        expect(body).toStrictEqual({
          ...apiErrorResponse(400, 'Bad Request'),
          message: "Request validation failed: body should have required property 'lastName'",
        });
      });

      test('it returns the status if longer than 80 chars', async () => {
        const { body } = await act({ data: { ...buildValidBody(), lastName: 'a'.repeat(81) } }).expect(400);

        expect(body).toStrictEqual({
          ...apiErrorResponse(400, 'Bad Request'),
          message: 'Request validation failed: body.lastName should NOT be longer than 80 characters',
        });
      });
    });

    describe('birthDate', () => {
      test('it returns the status if not an iso date', async () => {
        const { body } = await act({ data: { ...buildValidBody(), birthDate: '2020-13-12' } }).expect(400);

        expect(body).toStrictEqual({
          ...apiErrorResponse(400, 'Bad Request'),
          message: 'Request validation failed: body.birthDate should match format "date"',
        });
      });
    });

    describe('email', () => {
      test('it returns the status if not an email', async () => {
        const { body } = await act({ data: { ...buildValidBody(), email: 'not-an-email' } }).expect(400);

        expect(body).toStrictEqual({
          ...apiErrorResponse(400, 'Bad Request'),
          message: 'Request validation failed: body.email should match format "email"',
        });
      });

      test('it returns the status if longer than 120 chars', async () => {
        const { body } = await act({ data: { ...buildValidBody(), email: `${'a'.repeat(117)}@a.b` } }).expect(400);

        expect(body).toStrictEqual({
          ...apiErrorResponse(400, 'Bad Request'),
          message: 'Request validation failed: body.email should NOT be longer than 120 characters',
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
