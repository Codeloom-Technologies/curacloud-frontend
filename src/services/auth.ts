import { LoginApiPayload, LoginResponse } from "@/types/auth";
import { apiClient } from "@/lib/api-client";

export const submitLogging = async (
  payload: LoginApiPayload
): Promise<LoginResponse["data"]> => {
  const response = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response) {
    throw new Error(response?.message || "Failed to authenticate");
  }

  return response;
};

export const mapFormToLoginApiPayload = (formData: any): LoginApiPayload => {
  return {
    email: formData.email,
    password: formData.password,
  };
};

export const verifyEmail = async (token: string) => {
  const response = await apiClient(`/auth/verify-email?token=${token}`, {
    method: "GET",
  });

  if (!response) {
    throw new Error("Failed to verify email");
  }
  return response;
};
