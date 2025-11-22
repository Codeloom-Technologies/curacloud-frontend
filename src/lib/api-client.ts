// export const BASE_URL = "https://cura-cloud-api.onrender.com/api/v1";
// export const BASE_URL = "http://localhost:3333/api/v1";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response | any> => {
  const authToken = localStorage.getItem("authToken");
    const hospital = localStorage.getItem("hospital");
  const token = JSON.parse(authToken);
  const hospitalID = JSON.parse(hospital).xHospitalId
console.log({hospitalID})
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token.value}`;
  }


  if (hospitalID) {
    headers["X-Hospital-ID"] = `${hospitalID}`;
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
