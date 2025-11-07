import { apiClient } from "@/lib/api-client";

export const fetchUserById = async (id: string) => {
  if (!id) {
    throw new Error("user ID is required");
  }
  const response = await apiClient(`/users/${id}`);
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch patient");
  }
  return response;
};

export const updateUserAccount = async (
  id: string,
  payload: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    countryId: number;
    stateId: number;
    cityId?: number;
    username: string;
    title: string;
    address: {
      street: string;
    };
  }
) => {
  const response = await apiClient(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to update user");
  }
  return response;
};

export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await apiClient(`/users/change-password`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to change password");
  }
  return response;
};
