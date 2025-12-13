
import { apiClient } from "@/lib/api-client";

// Fetch admissions with filters
export const fetchAdmissions = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  priority?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.perPage) query.append("per_page", params.perPage.toString());
  if (params?.search) query.append("search", params.search);
  if (params?.status) query.append("status", params.status);
  if (params?.priority) query.append("priority", params.priority);

  const response = await apiClient(`/admissions?${query.toString()}`);
  return response;
};

// Fetch admission statistics
export const fetchAdmissionStats = async () => {
  const response = await apiClient("/admissions/stats");
  return response;
};

// Fetch available beds
export const fetchAvailableBeds = async () => {
  const response = await apiClient("/beds/available");
  return response;
};

// Fetch patients for admission
export const fetchPatientsForAdmission = async () => {
  const response = await apiClient("/patients/for-admission");
  return response.data;
};

// Admit a patient
export const admitPatient = async (admissionData: any) => {
  const response = await apiClient("/admissions", {
    method: "POST",
    body: JSON.stringify(admissionData),
  });
  return response;
};

// Discharge a patient
export const dischargePatient = async (dischargeData: {
  admissionId: number;
  discharge_reason: string;
  discharge_notes?: string;
  follow_up_date?: string;
  medication_prescribed?: string;
}) => {
  const response = await apiClient(`/admissions/${dischargeData.admissionId}/discharge`, {
    method: "POST",
    body: JSON.stringify(dischargeData),
  });
  return response;
};

// Transfer a patient
export const transferPatient = async (transferData: {
  admissionId: number;
  newBedId: number;
  reason: string;
  notes?: string;
}) => {
  const response = await apiClient(`/admissions/${transferData.admissionId}/transfer`, {
    method: "POST",
    body: JSON.stringify(transferData),
  });
  return response;
};