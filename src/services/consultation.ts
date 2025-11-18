import { apiClient } from "@/lib/api-client";

export const createConsultation = async (payload: {
  patientId: string;
  consultBy: string;
  name: string;
  consultationType: string;
  date: string;
  time: string;
  complain: string;
  diagnosis: string;
  treatmentPlan: string;
  clinicalNotes: string;
}) => {
  const response = await apiClient(`/consultations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create consultation ");
  }
  return response;
};

export const getConsultations = async (
page: number = 1,
  perPage: number = 5,
  search: string = "",
  filters: Record<string, any> = {}
) => {
 const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });

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
  const response = await apiClient(`/consultations?${queryParams}`, {
    method: "GET",
  });
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create consultation ");
  }
  const { data, meta } = response;
  return { consultations: data, meta };
};


export const getConsultationStats = async () => {
  const response = await apiClient('/consultations/stats')
  return response
}


