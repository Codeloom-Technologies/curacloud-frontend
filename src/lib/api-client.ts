export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response | any> => {
  const authToken = localStorage.getItem("authToken");
  const hospitalToken = localStorage.getItem("hospitalToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Handle auth token
  if (authToken) {
    try {
      const token = JSON.parse(authToken);
      if (token && token.value) {
        headers["Authorization"] = `Bearer ${token.value}`;
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }

  // Handle hospital header - FIXED
  if (hospitalToken && hospitalToken !== 'null' && hospitalToken !== 'undefined') {
    try {
        headers["X-Hospital-Token"] = hospitalToken;
    } catch (error) {
      // Don't throw, just continue without hospital header
    }
  }


  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to authenticate");
  }

  const responseData = await response.json();
  return responseData.data;
};