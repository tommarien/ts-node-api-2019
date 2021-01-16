// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const apiErrorResponse = (statusCode: number, error: string) => ({
  statusCode,
  error,
});
