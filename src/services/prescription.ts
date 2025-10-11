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
  search: string = ""
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });

  if (search && search.trim() !== "") {
    queryParams.append("search", search.trim());
  }

  const response = await apiClient(`/prescriptions?${queryParams}`, {
    method: "GET",
  });
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create Prescriptions ");
  }
  const { data, meta } = response;
  console.log({ data });
  return { prescriptions: data, meta };
};
