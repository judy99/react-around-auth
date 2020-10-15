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
      if (response.status === httpStatusCode.CREATED) {
        return response.json();
      }
      else {
        const err = new Error();
        err.message = '400';
        return err;
      }
    } catch(e){
        return (e);
    }
  })
  .then((res) => {
    return res;
  })
  .catch((err) => err);
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
      const err = new Error();
      if (response.status === httpStatusCode.OK) {
        return response.json();
      }
        else if (response.status === httpStatusCode.BAD_REQUEST) {
          err.message = '400';
          return err;
        }
        else if (response.status === httpStatusCode.UNAUTHORIZED) {
          err.message = '401';
          return err;
        }
        else {
          return err;
        }
    } catch(e) {
      console.log(e);
      return e;
    }
  })
  // .then((data) => {
  //   if (data.token) {
  //     localStorage.setItem('jwt', data.token);
  //     return data;
  //   }
  //   else {
  //     return;
  //   }
  // })
  // .catch((err) => err);
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
    .then(res => {
      if (res.status === httpStatusCode.UNAUTHORIZED) {
        throw new Error('Token is not provided or provided in the wrong format.');
      }
      return res.json();
    })
    .then(data => data)
    .catch(err => err);
}
