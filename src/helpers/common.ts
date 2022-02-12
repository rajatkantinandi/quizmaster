export const getCommaSeparatedStringWithAndBeforeTheLastItem = (arr: string[]): string => {
  return arr.reduce((acc, val, i, arr) => {
    return `${acc}${i > 0 ? (i === arr.length - 1 ? ' and ' : ', ') : ''}${val}`;
  }, '');
};