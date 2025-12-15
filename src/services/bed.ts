import { apiClient } from "@/lib/api-client";

export const fetchBeds = async (
  page: number = 1,
  perPage: number = 15,
  search: string = "",
  filters: Record<string, any> = {}
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });

  if (search && search.trim() !== "") {
    queryParams.append("search", search.trim());
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== false) {
      queryParams.append(key, String(value));
    }
  });

  const response = await apiClient(`/beds?${queryParams}`);
  const { data, meta } = response;
  return { beds: data, meta };
};

export const createBed = async (bedData: any) => {
  const response = await apiClient(`/beds`, {
    method: "POST",
    body: JSON.stringify(bedData),
  });
  return response;
};

export const updateBed = async (id: string, bedData: any) => {
  const response = await apiClient(`/beds/${id}`, {
    method: "PUT",
    body: JSON.stringify(bedData),
  });
  return response;
};

export const updateBedStatus = async (id: string, status: string) => {
  const response = await apiClient(`/beds/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response;
};

export const fetchBedById = async (id: string) => {
  const response = await apiClient(`/beds/${id}/reference`, {
    method: "GET",
  });
  return response;
};


export const deleteBed = async (id: string) => {
  const response = await apiClient(`/beds/${id}`, {
    method: "DELETE",
  });
  return response;
};

// Patient Bed Assignment
export const assignBedToPatient = async (assignmentData: {
  patientId: number;
  bedId: number;
  admissionId?: number;
  expectedDischargeDate?: string;
  notes?: string;
}) => {
  const response = await apiClient("/bed-assignments", {
    method: "POST",
    body: JSON.stringify(assignmentData),
  });
  return response;
};

export const dischargePatientFromBed = async (assignmentId: number, dischargeData: {
  dischargeReason: string;
  notes?: string;
}) => {
  const response = await apiClient(`/bed-assignments/${assignmentId}/discharge`, {
    method: "PATCH",
    body: JSON.stringify(dischargeData),
  });
  return response;
};

// Nurse Attendance
export const fetchNurseAttendanceLogs = async (filters?: {
  wardId?: number;
  date?: string;
  nurseId?: number;
}) => {
  const query = new URLSearchParams();
  if (filters?.wardId) query.append("ward_id", filters.wardId.toString());
  if (filters?.date) query.append("date", filters.date);
  if (filters?.nurseId) query.append("nurse_id", filters.nurseId.toString());
  
  const response = await apiClient(`/nurse-attendance?${query.toString()}`);
  return response;
};

export const createNurseAttendanceLog = async (logData: any) => {
  const response = await apiClient("/nurse-attendance", {
    method: "POST",
    body: JSON.stringify(logData),
  });
  return response;
};

export const fetchPatientsInWard = async (wardId?: number) => {
  const query = wardId ? `?ward_id=${wardId}` : "";
  const response = await apiClient(`/patients-in-ward${query}`);
  return response;
};