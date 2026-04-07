const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  "http://localhost:5000";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

export const apiRequest = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(buildUrl(path), {
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...((options.headers || {})),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_error) {
    data = null;
  }

  if (!response.ok || (data && data.success === false)) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
};

export const apiConfig = {
  baseUrl: API_BASE_URL,
};
