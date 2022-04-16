export const setCookie = (name: any, value: any, exdays?: any): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

  const exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);

  const cookieValue = `${name}=${encodeURIComponent(value)}; `;
  const expires = exdays ? `expires=${exdate.toUTCString()}; ` : '';
  const domain = window.location.href.includes('localhost') ? '' : 'domain=.quizmaster.com; ';

  const cookie = `${cookieValue}${expires}${domain}path=/`;
  document.cookie = cookie;
};

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
