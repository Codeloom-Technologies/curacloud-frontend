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


export const createSetHospital = async (hospitalId: string) => {
  const response = await apiClient(`/auth/set-hospital`, {
    method: "POST",
    body: JSON.stringify(hospitalId)
  });

  if (!response) {
    throw new Error("Failed to verify email");
  }
  return response;
};

export const connectedHospital = async () => {
  const response = await apiClient(`/auth/connected-hospital`);

  if (!response) {
    throw new Error("Failed to ftech");
  }
  return response;
};



export const verifyInvitation = async (token: string) => {
  const response = await apiClient(`/auth/verify-invitation`, {
    method: 'POST',
    body: JSON.stringify({token})
  });
  return response;
};

export const acceptInvitation = async (data: { token: string; password: string }) => {
  const response = await apiClient("/auth/accept-invitation", {
    method: "POST",
    body: JSON.stringify(data)
  });
  return response;
};


export const forgotPasswordMutation = async (email: string) => {
  return await apiClient("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};


 export const resetPasswordMutation = async (data: { 
  token: string; 
  password: string; 
  passwordConfirmation: string;
 }) => {
  return await apiClient("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};


export const verifyHealthcareInvite = async (token: string) => {
  const response = await apiClient(`/healthcares/invite-verify?token=${token}`, {
    method: "GET",
  });

  if (!response) {
    throw new Error("Failed to verify healthcares invite");
  }
  return response;
};
