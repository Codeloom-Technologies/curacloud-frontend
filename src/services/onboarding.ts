import { OnboardingApiPayload } from "@/types/onboarding";
import { apiClient, BASE_URL } from "@/lib/api-client";

const ROLE_MAP: Record<string, number> = {
  doctor: 9,
  nurse: 12,
  healthcare: 4,
};

export interface Country {
  id: number;
  name: string;
  phoneCode: string;
  flag: {
    svg: string;
    png: string;
  };
}

export interface State {
  id: number;
  name: string;
  countryId: number;
}

export interface City {
  id: number;
  name: string;
  stateId: number;
}

export const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch(`${BASE_URL}/countries`);
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }
  const countries = await response.json();
  return countries.data;
};

export const fetchStates = async (countryId: number): Promise<State[]> => {
  const response = await fetch(`${BASE_URL}/states/${countryId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch states");
  }
  const states = await response.json();
  return states.data;
};

export const fetchCities = async (stateId: number): Promise<City[]> => {
  const response = await fetch(`${BASE_URL}/cities/${stateId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }
  const cities = await response.json();
  return cities.data;
};

export const submitOnboarding = async (payload: OnboardingApiPayload) => {
  const response = await apiClient("/healthcares", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to submit onboarding");
  }
  return response;
};

export const mapFormToApiPayload = (formData: any): OnboardingApiPayload => {
  return {
    facilityName: formData.facilityName,
    fullName: formData.fullName,
    email: formData.email,
    password: formData.password,
    phoneNumber: formData.phoneCode + formData.phone.replace(/^0+/, ""),
    phoneCode: formData.phoneCode,
    roleId: 4, // TODO Health care
    countryId: Number(formData.countryId),
    stateId: Number(formData.stateId),
    cityId: Number(formData.cityId),
    role: formData.role,
    facilitySize: formData.facilitySize,
    facilityType: formData.facilityType,
    position: formData.position,
    address: {
      postalCode: formData.postalCode,
      streetAddress: formData.address,
    },
  };
};
