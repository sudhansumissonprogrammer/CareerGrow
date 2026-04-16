const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  "/_/backend";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const normalizedBaseUrl = API_BASE_URL ? trimTrailingSlash(API_BASE_URL) : "";

export const buildApiUrl = (path) => {
  if (!path.startsWith("/")) {
    throw new Error(`API path must start with "/": ${path}`);
  }

  return normalizedBaseUrl ? `${normalizedBaseUrl}${path}` : path;
};

export const buildAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return buildApiUrl(path.startsWith("/") ? path : `/${path}`);
};

export const apiRequest = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(buildApiUrl(path), {
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
};
