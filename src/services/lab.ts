import { apiClient } from "@/lib/api-client";

export const createLabOrder = async (payload: any) => {
  const response = await apiClient("/lab-orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create lab order ");
  }
  return response;
};





export const uploadLabResults = async (payload: any) => {
  const response = await apiClient(`/lab-orders/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create lab order ");
  }
  return response;
};


export const getLabOrders = async (
    page: number = 1,
  perPage: number=15,
search: string = "",
filters:any
) => {
    const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });

  // Add search only if it's not empty
  if (search && search.trim() !== "") {
    queryParams.append("search", search.trim());
  }
     
      Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== false) {
      queryParams.append(key, String(value));
    }
      });
    
  const response = await apiClient(`/lab-orders?${queryParams}`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create lab order ");
  }
  const { data, meta } = response;
    return { labOrders: data, meta };
};


export const getLabStats = async () => {
  const response = await apiClient(`/lab-orders/stats`,);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create lab order ");
  }
  return response;
};


export const getLabOrderReport = async (id:string) => {
  const response = await apiClient(`/lab-orders/${id}`,);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create lab order ");
  }
  return response;
};