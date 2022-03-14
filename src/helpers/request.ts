import config from '../config';
import queryString from 'qs';

function getEndpointFullUrl(api: string, queryParams: any = {}): string {
  return `${config.backendUrl}/${api}?${queryString.stringify(queryParams, { arrayFormat: 'brackets' })}`;
}

export const get = async (url: string, queryParams = {}) => {
  const response = await fetch(getEndpointFullUrl(url, queryParams));

  return response.json();
};

export const post = async (url: string, data = {}) => {
  // Default options are marked with *
  const response = await fetch(getEndpointFullUrl(url), {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
};
