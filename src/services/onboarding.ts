import { OnboardingApiPayload } from "@/types/onboarding";

const BASE_URL = "http://localhost:3333/api/v1";

// TODO: Replace these with actual mappings from your backend
const ROLE_MAP: Record<string, number> = {
  doctor: 4,
  nurse: 3,
  admin: 2,
  other: 5,
};

const COUNTRY_MAP: Record<string, number> = {
  Nigeria: 1,
  Ghana: 2,
  Kenya: 3,
  // Add more countries as needed
};

// TODO: Get actual state/city IDs from backend
const STATE_MAP: Record<string, number> = {
  Lagos: 2,
  Abuja: 1,
  // Add more states as needed
};

const CITY_MAP: Record<string, number> = {
  Lagos: 4,
  Abuja: 1,
  // Add more cities as needed
};

export const submitOnboarding = async (payload: OnboardingApiPayload) => {
  const response = await fetch(`${BASE_URL}/healthcares`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit onboarding");
  }

  return response.json();
};

export const mapFormToApiPayload = (formData: any): OnboardingApiPayload => {
  return {
    facilityName: formData.facilityName,
    fullName: formData.fullName,
    email: formData.email,
    password: formData.password,
    phoneNumber: formData.phone,
    roleId: ROLE_MAP[formData.role] || 4,
    countryId: COUNTRY_MAP[formData.country] || 1,
    stateId: STATE_MAP[formData.state] || 2,
    cityId: CITY_MAP[formData.city] || 4,
    role: "Health",
    facilitySize: formData.facilitySize,
    facilityType: formData.facilityType,
    position: formData.position,
    address: {
      postalCode: formData.postalCode,
      streetAddress: formData.address,
    },
  };
};
