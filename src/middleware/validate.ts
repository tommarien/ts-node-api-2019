/* eslint-disable @typescript-eslint/ban-types */
import Ajv, { ValidateFunction } from 'ajv';
import { RequestHandler } from 'express';

type RouteSchema = {
  query?: object;
  params?: object;
  body?: object;
};

type RouteParts = keyof RouteSchema;

const validatedRouteParts: readonly RouteParts[] = ['params', 'body', 'query'];

const buildBadRequest = (message: string) => {
  return { statusCode: 400, error: 'Bad Request', message };
};

export default function validate(routeSchema: RouteSchema): RequestHandler {
  const ajv = new Ajv({
    coerceTypes: true,
    useDefaults: true,
    removeAdditional: true,
    nullable: true,
    format: 'full', // Default is fast, which would allow invalid dates
    allErrors: false, // Explicitly set to false
  });

  const validators = validatedRouteParts.reduce((previousValue, currentValue) => {
    const partSchema = routeSchema[currentValue];

    // eslint-disable-next-line no-param-reassign
    if (partSchema) previousValue[currentValue] = ajv.compile(partSchema);

    return previousValue;
  }, {} as Partial<Record<RouteParts, ValidateFunction>>);

  return function validationRequestHandler(req, res, next) {
    validatedRouteParts.forEach((part) => {
      const validatePart = validators[part];

      if (validatePart) {
        if (!validatePart(req[part]))
          res
            .status(400)
            .send(
              buildBadRequest(
                `Request validation failed: ${ajv.errorsText(validatePart.errors, { dataVar: `${part}` })}`
              )
            );
      }
    });

    return next();
  };
}
