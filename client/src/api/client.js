const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL ;
const backendUrl = rawBackendUrl.replace(/\/+$/, '');
const BASE_URL = `${backendUrl}/api/v1`;

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const data = await response.json();
      if (data.fieldErrors && typeof data.fieldErrors === 'object') {
        const details = Object.entries(data.fieldErrors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' | ');
        errorMsg = `${data.error || 'Validation failed'}: ${details}`;
      } else if (data.error) {
        errorMsg = data.error;
      }
    } catch (e) {
      // Not JSON
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
