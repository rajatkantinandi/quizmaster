import config from '../config';
import queryString from 'qs';
import Cookies from 'js-cookie';

function getEndpointFullUrl(api: string, queryParams: any = {}): string {
  return `${config.backendUrl}/${api}?${queryString.stringify(queryParams, { arrayFormat: 'brackets' })}`;
}

export const get = async (url: string, queryParams = {}) => {
  const response = await fetch(getEndpointFullUrl(url, queryParams), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  handleUnAuthorized(response);

  return response.json();
};

export const post = async (url: string, data = {}) => {
  // Default options are marked with *
  const response = await fetch(getEndpointFullUrl(url), {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  try {
    handleUnAuthorized(response);
    checkStatus(response);

    return parseJSON(response);
  } catch (err: any) {
    const message = await err.response.json();
    throw message;
  }
};

export const postBeaconReq = async (url: string, data = {}) => {
  navigator.sendBeacon(getEndpointFullUrl(url), JSON.stringify(data));
};

export const postRedirect = async (url: string, data: any) => {
  const form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', getEndpointFullUrl(url));

  const createHiddenField = (name: string, value: string) => {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', name);
    hiddenField.setAttribute('value', value);
    return hiddenField;
  };

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const hiddenField = createHiddenField(key, data[key]);
      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
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

function handleUnAuthorized(response: any): void {
  if (response.status === 401) {
    window.location.pathname = '/login';
  }
}
