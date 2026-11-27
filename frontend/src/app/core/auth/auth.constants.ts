export const API_BASE_URL = '/api';

export const AUTH_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  me: `${API_BASE_URL}/users/me`,
} as const;

export const AUTH_STORAGE_KEY = 'retail_ordering_auth_session';

export const PHONE_PATTERN = /^\+?\d+$/;
export const NON_WHITESPACE_PATTERN = /\S/;
