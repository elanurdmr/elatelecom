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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
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
