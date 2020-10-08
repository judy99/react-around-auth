const BASE_URL = 'https://register.nomoreparties.co';

export const register = (email, password) => {
  console.log(email, password);
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then((response) => {
    try {
      if (response.status === 201){
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
