export const signin = data =>
  fetch('/api/auth/signin', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  }).then(response => response.json());

export const signup = data =>
  fetch('/api/auth/signup', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  }).then(response => response.json());
