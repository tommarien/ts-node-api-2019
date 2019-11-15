import sum from './calc';

test('it adds both numbers int', () => {
  const result = sum(2, 4);
  expect(result).toBe(6);
});
