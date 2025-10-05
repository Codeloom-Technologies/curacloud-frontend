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
  totalPages: number;
  page: number;
  perPage: number;
}

export const fetchPatients = async (
  page: number = 1,
  perPage: number = 10,
  search: string = "",
  filters: Record<string, any> = {}
): Promise<PaginatedPatientsResponse | any> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });

  // await new Promise((r) => setTimeout(r, 2000)); // ⏳ simulate 2s delay

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

  const response = await apiClient(`/patients?${queryParams}`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to register patient");
  }
  const { data, meta } = response;
  return { patients: data, meta };
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

export const patientStatsTotalPerProvider = async () => {
  const response = await apiClient("/patients/stats/total-per-provider");

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to register patient");
  }
  console.log(response);
  return response;
};
