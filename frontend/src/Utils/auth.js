const TOKEN_KEY = 'skillsync_token';
const USER_KEY  = 'skillsync_user';
const LOGIN_AT_KEY = 'skillsync_login_at';

export const saveAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOGIN_AT_KEY, new Date().toISOString());
};
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser  = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};
export const isLoggedIn = () => !!getToken();
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LOGIN_AT_KEY);
};
export const getLoggedInAt = () => {
  const raw = localStorage.getItem(LOGIN_AT_KEY);
  return raw ? new Date(raw) : null;
};
export const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});
export const decodeToken = (token) => {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch { return null; }
};
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  const p = decodeToken(token);
  if (!p?.exp) return true;
  return Date.now() / 1000 > p.exp;
};