import { BASE_URL } from "./api-client";

// For regular JSON requests
export const apiUploadClient = async (
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
    throw new Error(error.message || "Request failed");
  }

  const responseData = await response.json();
  return responseData.data;
};

// For file uploads (FormData)
export const uploadClient = async (
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<Response | any> => {
  const authToken = localStorage.getItem("authToken");
  const hospitalToken = localStorage.getItem("hospitalToken");

  const headers: HeadersInit = {
    // ⚠️ No Content-Type header for FormData
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

  // Handle hospital header
  if (hospitalToken && hospitalToken !== 'null' && hospitalToken !== 'undefined') {
    try {
      headers["X-Hospital-Token"] = hospitalToken;
    } catch (error) {
      // Don't throw, just continue without hospital header
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    ...options,
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Upload failed");
  }

  const responseData = await response.json();
  return responseData.data;
};