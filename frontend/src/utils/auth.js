const AUTH_KEY = "job-portal-auth-user";

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (!user) {
    localStorage.removeItem(AUTH_KEY);
    return;
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem(AUTH_KEY);
};
