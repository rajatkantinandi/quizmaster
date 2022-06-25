import Cookies from 'js-cookie';

export const getCommaSeparatedStringWithAndBeforeTheLastItem = (arr: string[]): string => {
  return arr.reduce((acc, val, i, arr) => {
    return `${acc}${i > 0 ? (i === arr.length - 1 ? ' and ' : ', ') : ''}${val}`;
  }, '');
};

export const isGuestUser = () => Cookies.get('userName') === 'guest';
