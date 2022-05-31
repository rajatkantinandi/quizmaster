export const getCookie = (name: string): string => {
  const value = document.cookie;
  let start = value.indexOf(' ' + name + '=');

  if (start === -1) {
    start = value.indexOf(name + '=');
  }

  if (start === -1) {
    return '';
  } else {
    start = value.indexOf('=', start) + 1;
    let end = value.indexOf(';', start);

    if (end === -1) {
      end = value.length;
    }

    return decodeURIComponent(value.substring(start, end));
  }
};
