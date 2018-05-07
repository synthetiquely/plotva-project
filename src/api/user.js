export const updateProfile = data =>
  fetch('/api/user/profile', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  }).then(response => response.json());

export const updateAvatar = data => {
  const formData = new FormData();
  formData.append('avatar', data);
  return fetch('/api/user/avatar', {
    method: 'post',
    body: formData,
    credentials: 'same-origin',
  }).then(response => response.json());
};
