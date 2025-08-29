const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const api = async (endpoint, method = 'GET', body = null) => {
  const headers = getAuthHeaders();
  const config = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) })
  };

  try {
    const normalizedBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const finalUrl = `${normalizedBaseUrl}/${normalizedEndpoint}`;

    const response = await fetch(finalUrl, config);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API request failed for ${endpoint}`);
    }
    return response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export default api;
