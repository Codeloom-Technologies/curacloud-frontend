import { apiClient } from "@/lib/api-client";
import { CreateStaffRequest } from "@/types";

export const fetchRoles = async () => {
  const response = await apiClient(`/roles`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch roles");
  }
  return response;
};

export const fetchDepartments = async () => {
  const response = await apiClient(`/departments`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch departments");
  }
  return response;
};

export const registerStaff = async (payload: CreateStaffRequest) => {
  const response = await apiClient("/staffs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to register a staff");
  }
  return response;
};

export const fetchStaffs = async (
  page: number = 1,
  perPage: number = 5,
  search: string = "",
  filters: Record<string, any> = {}
): Promise<any> => {
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

  const response = await apiClient(`/staffs?${queryParams}`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch staff");
  }
  const { data, meta } = response;
  return { staffs: data, meta };
};

export const fetchStaffById = async (staffId: string) => {
  if (!staffId) {
    throw new Error("Staff ID is required");
  }

  const response = await apiClient(`/staffs/${staffId}`);
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch staff");
  }
  return response;
};

export const staffStatsTotalPerProvider = async () => {
  const response = await apiClient("/staffs/stats/total-per-provider");
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch statistics");
  }
  return response;
};

export const updateStaff = async (
  staffId: string,
  payload: CreateStaffRequest
) => {
  const response = await apiClient(`/staffs/${staffId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to update staff");
  }
  return response;
};
