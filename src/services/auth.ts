import { LoginApiPayload } from "@/types/auth";
const BASE_URL = "http://localhost:3333/api/v1";

export const submitLogging = async (payload: LoginApiPayload) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to authenticate ");
  }
  const user = await response.json();
  return user.data;
};

export const mapFormToLoginApiPayload = (formData: any): LoginApiPayload => {
  return {
    email: formData.email,
    password: formData.password,
  };
};
