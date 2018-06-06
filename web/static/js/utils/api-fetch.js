import fetch from 'isomorphic-fetch';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

function buildHeaders() {
  const authToken = localStorage.getItem('swimlanesAuthToken');

  return { ...defaultHeaders, Authorization: authToken };
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  var error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export function parseJSON(response) {
  return response.json();
}

export function httpGet(url) {
  return fetch(url, {
    headers: buildHeaders()
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpPost(url, data) {
  const body = JSON.stringify(data);
  return fetch(url, {
    method: 'post',
    headers: buildHeaders(),
    body: body
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpPatch(url, data) {
  const body = JSON.stringify(data);
  return fetch(url, {
    method: 'PUT',
    headers: buildHeaders(),
    body: body
  })
  .then(checkStatus)
  .then(parseJSON);
}

export function httpDelete(url) {
  return fetch(url, {
    method: 'delete',
    headers: buildHeaders()
  })
  .then(checkStatus)
  .then(parseJSON);
}
