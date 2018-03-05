import * as types from './action-types';

export const authCheck = () => ({
  type: types.AUTH_CHECK
});

export const authLogin = (payload) => ({
  type: types.AUTH_LOGIN,
  payload,
});

export const authLogout = () => ({
  type: types.AUTH_LOGOUT,
});

export const authRefreshToken = (payload) => ({
  type: types.AUTH_REFRESH_TOKEN,
  payload
});

export const authResetPassword = () => ({
  type: types.AUTH_RESET_PASSWORD,
});

export const authUser = (payload) => ({
  type: types.AUTH_USER,
  payload
});