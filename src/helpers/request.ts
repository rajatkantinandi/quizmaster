import config from '../config';
import queryString from 'qs';
import { getCookie } from '../helpers/cookieHelper';

function getEndpointFullUrl(api: string, queryParams: any = {}): string {
  return `${config.backendUrl}/${api}?${queryString.stringify(queryParams, { arrayFormat: 'brackets' })}`;
}

export const get = async (url: string, queryParams = {}) => {
  const response = await fetch(getEndpointFullUrl(url, queryParams), {
    headers: {
      'Content-Type': 'application/json',
      'auth-token': getCookie(config.tokenKey),
    },
  });

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
      'auth-token': getCookie(config.tokenKey),
    },
    body: JSON.stringify(data),
  });

  try {
    checkStatus(response);
    return parseJSON(response);
  } catch (err: any) {
    const message = await err.response.json();
    throw message;
  }
};

export const postBeaconReq = async (url: string, data = {}) => {
  navigator.sendBeacon(
    getEndpointFullUrl(url),
    JSON.stringify({
      ...data,
      'auth-token': getCookie(config.tokenKey),
    }),
  );
};

class ResponseError extends Error {
  public response: Response;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}

function checkStatus(response: Response): void {
  if (!(response.status >= 200 && response.status < 300)) {
    const error = new ResponseError(response);
    error.response = response;
    throw error;
  }
}

async function parseJSON(response: any): Promise<any> {
  if (response.status === 204 || response.status === 205) {
    return null;
  } else {
    const resp = await response.json();
    return resp;
  }
}
