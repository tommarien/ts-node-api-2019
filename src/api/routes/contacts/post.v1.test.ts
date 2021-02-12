import { parse } from 'date-fns';
import request from 'supertest';
import { apiErrorResponse } from '../../../../test/apiError';
import dbHelper from '../../../../test/dbHelper';
import pool from '../../../data/pool';
import app from '../../app';

const RESOURCE_URI = '/api/v1/contacts';

describe(`POST ${RESOURCE_URI}`, () => {
  function buildValidBody() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@yahoo.com',
    };
  }

  function act({ data = {}, apiKey = process.env.ALLOWED_API_KEYS } = {}) {
    const req = request(app).post(RESOURCE_URI).send(data);

    if (apiKey) req.set('X-Api-Key', apiKey);

    return req;
  }

  beforeAll(() => dbHelper.truncateTable('contacts'));

  afterAll(() => pool.end());

  describe('HTTP 200 (OK)', () => {
    test('it returns the status and stores a new contact with minimum props', async () => {
      const contact = buildValidBody();

      const { body } = await act({ data: contact }).expect(200);

      expect(body).toStrictEqual({
        id: expect.any(String),
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
      });

      const row = await dbHelper.findById('contacts', body.id);

      expect(row).toStrictEqual({
        id: body.id,
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        birth_date: null,
      });
    });

    test('it returns the status and stores a new contact with all props', async () => {
      const contact = { ...buildValidBody(), birthDate: '1980-09-15' };

      const { body } = await act({ data: contact }).expect(200);

      expect(body).toStrictEqual({
        id: expect.any(String),
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        birthDate: contact.birthDate,
      });

      const row = await dbHelper.findById('contacts', body.id);

      expect(row).toStrictEqual({
        id: body.id,
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        birth_date: parse(body.birthDate, 'yyyy-MM-dd', new Date()),
      });
    });
  });

  describe('HTTP 400 (Bad Request)', () => {
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
      const { body } = await act({ data: buildValidBody(), apiKey: '' }).expect(401);

      expect(body).toStrictEqual({
        ...apiErrorResponse(401, 'Unauthorized'),
        message: 'No Api key specified (X-API-Key header)',
      });
    });
  });
});
