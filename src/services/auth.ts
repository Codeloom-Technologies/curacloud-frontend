import { LoginApiPayload } from "@/types/auth";
import { apiClient } from "@/lib/api-client";

export const submitLogging = async (payload: LoginApiPayload) => {
  const response = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to authenticate ");
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
  console.log(response);
  return response;
};
