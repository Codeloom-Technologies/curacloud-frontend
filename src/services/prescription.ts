import { apiClient } from "@/lib/api-client";

export const createPrescription = async (payload: {
  patientId: string;
  prescripBy: string;
  name: string;
  instructions: string;
  frequency: string;
  dosage: string;
  medicationName: string;
  notes: string;
}) => {
  const response = await apiClient(`/prescriptions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create Prescriptions ");
  }
  return response;
};

export const getPrescriptions = async (
  page: number = 1,
  perPage: number = 5,
  search: string = "",
  statusFilter: string
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
    ...(search && { search }),
    ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
  });
  const response = await apiClient(`/prescriptions?${queryParams}`, {
    method: "GET",
  });
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create Prescriptions ");
  }
  const { data, meta } = response;
  return { prescriptions: data, meta };
};

export const getPrescriptionStats = async () => {
  const response = await apiClient(`/prescriptions/stats`);
  return response;
};
