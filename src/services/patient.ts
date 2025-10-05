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
  bloodGroup?: string;
  genotype?: string;
  patientEmergencyContact: {
    fullName: string;
    phoneNumber: string;
    relationship: string;
  };
}

export const registerPatient = async (payload: PatientPayload) => {
  const response = await apiClient("/patients", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to register patient");
  }

  const result = await response.json();
  return result.data;
};
