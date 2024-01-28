export const isInt = (value) => {
  if (isNaN(value)) {
    return false;
  }
  const x = parseFloat(value);
  return (x | 0) === x;
};

export function isObject(item): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}
