import Cookies from 'js-cookie';

export const getCommaSeparatedStringWithAndBeforeTheLastItem = (arr: string[]): string => {
  return arr.reduce((acc, val, i, arr) => {
    return `${acc}${i > 0 ? (i === arr.length - 1 ? ' and ' : ', ') : ''}${val}`;
  }, '');
};

export const isGuestUser = () => Cookies.get('userName') === 'guest';

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};

export const pickTextColorBasedOnBgColorSimple = (bgColor) => {
  const color = bgColor.substring(1, 7);
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB

  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? 'rgba(0, 0, 0, 0.5)' : '#ffffff';
};
