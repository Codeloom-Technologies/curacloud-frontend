export const BASE_URL = "http://localhost:3333/api/v1";

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response | any> => {
  const token = localStorage.getItem("authToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to authenticate ");
  }
  const responseData = await response.json();
  return responseData.data;
};
