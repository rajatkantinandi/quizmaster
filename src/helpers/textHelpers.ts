export const plural = (count: number, singular: string, pluralValue: string): string => {
  return count === 1 ? singular.replace('%count', count.toString()) : pluralValue.replace('%count', count.toString());
};

export const toCamelCaseFromPascalCase = (str: string): string => {
  if (str.length > 0) {
    return str[0].toLowerCase() + str.slice(1);
  } else {
    return str;
  }
};
