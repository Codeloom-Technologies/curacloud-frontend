import { apiClient } from "@/lib/api-client";

export const createPharmacyInventory = async (payload: any) => {
  const response = await apiClient("/pharmacy/inventories", {
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

  const response = await apiClient(`/pharmacy/inventories?${queryParams}`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch inventories");
  }
  const { data, meta } = response;

  return { inventories: data, meta };
};



export const fetchInventorySummary = async (): Promise<any | any> => {
  const response = await apiClient(`/pharmacy/inventories/summary/inventory`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch inventories");
  }
  return response;
};

export interface AdjustStockPayload {
  inventoryId: number;
  quantity: number;
  reason: string;
  type: "Stock In" | "Stock Out";
}

export const adjustStock = async (payload: AdjustStockPayload) => {
  const response = await apiClient("/pharmacy/stocks/adjust", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create inventory ");
  }
  return response;
};

export const getStockHistory = async (
  page: number = 1,
  perPage: number = 5,
  search: string = "",
  filters: Record<string, any> = {}
) => {
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

  const response = await apiClient(`/pharmacy/stocks/history?${queryParams}`);
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch stock ");
  }
  const { data, meta } = response;
  return { inventories: data, meta };
};

export const getInventoryStockHistory = async (
  inventoryId: number,
  page: number = 1,
  perPage: number = 10
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const response = await apiClient(
    `/pharmacy/stocks/history/${inventoryId}?${params}`
  );
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch stock ");
  }
  return response;
};

export const getStockSummary = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const response = await apiClient(`/pharmacy/stocks/summary?${params}`);
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch stock ");
  }
  return response;
};

export const getLowStockAlerts = async () => {
  const response = await apiClient("/pharmacy/stocks/low-stock-alerts");
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch stock ");
  }
  return response;
};

export const getStockMedications = async () => {
  const response = await apiClient(
    "/pharmacy/inventories/medications/inventory"
  );
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch stock ");
  }
  return response;
};
