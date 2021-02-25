import Ajv, { ValidateFunction } from 'ajv';
import { RequestHandler } from 'express';

type RouteSchema = {
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
};

type RouteParts = keyof RouteSchema;

const validatedRouteParts: readonly RouteParts[] = ['params', 'body', 'query'];

const buildBadRequest = (message: string) => ({ statusCode: 400, error: 'Bad Request', message });

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
    // eslint-disable-next-line no-restricted-syntax
    for (const part of validatedRouteParts) {
      const partValidate = validators[part];

      if (partValidate && !partValidate(req[part])) {
        res
          .status(400)
          .send(
            buildBadRequest(`Request validation failed: ${ajv.errorsText(partValidate.errors, { dataVar: `${part}` })}`)
          );

        return;
      }
    }
    next();
  };
}
