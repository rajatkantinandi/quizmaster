export const plural = (count: number, singular: string, pluralValue: string): string => {
  return count === 1 ? singular.replace('%count', count.toString()) : pluralValue.replace('%count', count.toString());
};

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const getValidValuesFromColumns = (string) =>
  string
    .split('\n')
    .map((x) => x.trim())
    .filter((x) => !!x);
