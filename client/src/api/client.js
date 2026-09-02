const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL ;
const backendUrl = rawBackendUrl.replace(/\/+$/, '');
const BASE_URL = `${backendUrl}/api/v1`;

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const data = await response.json();
      const rawFieldErrors = data.fieldErrors || (typeof data.error === 'object' && data.error !== null ? data.error : null);
      
      if (rawFieldErrors && typeof rawFieldErrors === 'object') {
        const details = Object.entries(rawFieldErrors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : v)}`)
          .join(' | ');
        errorMsg = typeof data.error === 'string' ? `${data.error}: ${details}` : details || 'Validation failed';
      } else if (typeof data.error === 'string') {
        errorMsg = data.error;
      } else if (typeof data.message === 'string') {
        errorMsg = data.message;
      } else if (data.error && typeof data.error.message === 'string') {
        errorMsg = data.error.message;
      }
    } catch (e) {
      // Not JSON or empty body
    }
    throw new Error(errorMsg);
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  // Set default credentials to include so cookies are sent/received
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    credentials: 'include', // essential for Better Auth and sessions
    ...options,
    headers,
  };

  // If request body is FormData (e.g., image upload), let the browser set the Content-Type automatically
  if (config.body instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  return handleResponse(response);
};
