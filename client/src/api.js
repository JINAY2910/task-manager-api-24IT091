const BASE_URL = 'http://localhost:3000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    if (res.status === 401) {
      // Dispatch a custom event to notify the app to logout
      window.dispatchEvent(new Event('unauthorized'));
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'API Error');
  }
  return res.json();
};

export const loginUser = (data) =>
  fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const registerUser = (data) =>
  fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const getMe = () =>
  fetch(`${BASE_URL}/me`, {
    headers: getHeaders(),
  }).then(handleResponse);

export const getTasks = () =>
  fetch(`${BASE_URL}/tasks`, { headers: getHeaders() }).then(handleResponse);

export const createTask = (data) =>
  fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateTask = (id, data) =>
  fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteTask = (id) =>
  fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);
