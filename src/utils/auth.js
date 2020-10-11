import { httpStatusCode } from '../utils/utils.js';

const BASE_URL = 'https://register.nomoreparties.co';


export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then((response) => {
    try {
      if (response.status === httpStatusCode.CREATED){
        return response.json();
      }
    } catch(e){
        return (e)
    }
  })
  .then((res) => {
    return res;
  })
  .catch((err) => console.log(err));
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then((response) => {
    try {
      if (response.status === httpStatusCode.BAD_REQUEST) {
        throw new Error('One or more of the fields were not provided.');
      }
      else if (response.status === httpStatusCode.UNAUTHORIZED) {
        throw new Error('The user with the specified email not found.');
      }
      else {
        return response.json();
      }
    } catch(e) {
      console.log(e);
      return e;
    }
  })
  .then((data) => {
    if (data.token) {
      localStorage.setItem('jwt', data.token);
      return data;
    }
    else {
      return;
    }
  })
  .catch((err) => console.log(err));
};

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(res => res.json())
    .then(data => data)
}
