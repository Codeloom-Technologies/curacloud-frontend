import { apiClient } from "@/lib/api-client";

export const createPharmacyInventory = async (payload: any) => {
  const response = await apiClient("/pharmacies/inventories", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create inventory ");
  }
  return response;
};

export const fetchPharmacyInventories = async (
  page: number = 1,
  perPage: number = 5,
  search: string = "",
  filters: Record<string, any> = {}
): Promise<any | any> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });

  // Add search only if it's not empty
  if (search && search.trim() !== "") {
    queryParams.append("search", search.trim());
  }

  // Add filters dynamically (only non-empty values)
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== false) {
      queryParams.append(key, String(value));
    }
  });

  const response = await apiClient(`/pharmacies/inventories?${queryParams}`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch inventories");
  }
  const { data, meta } = response;
  return { inventories: data, meta };
};

export const fetchInventorySummary = async (): Promise<any | any> => {
  const response = await apiClient(`/pharmacies/inventories/inventory/summary`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch inventories");
  }
  return response;
};
