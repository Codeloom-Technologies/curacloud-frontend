import { apiClient } from "@/lib/api-client";

export interface PatientPayload {
  email: string;
  phoneNumber: string;
  countryId: number;
  roleId: number;
  title: string;
  stateId: number;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  nationalId?: string;
  maritalStatus?: string;
  address: {
    street: string;
    postalCode: string;
  };
  address2: string;
  bloodGroup?: string;
  genotype?: string;
  patientEmergencyContact: {
    fullName: string;
    phoneNumber: string;
    relationship: string;
  };
}

export interface PaginatedPatientsResponse {
  patients: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const fetchPatients = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<PaginatedPatientsResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: limit.toString(),
    ...(search && { search }),
  });

  return await apiClient(`/patients?${queryParams}`);
};

export const registerPatient = async (payload: PatientPayload) => {
  const response = await apiClient("/patients", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to register patient");
  }
  return response;
};
