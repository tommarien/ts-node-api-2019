import sum from './calc';

test('it adds both numbers', () => {
  const result = sum(1, 4);
  expect(result).toBe(5);
});
