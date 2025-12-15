import { apiClient } from "@/lib/api-client";

export const fetchWards = async (
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

  const response = await apiClient(`/wards?${queryParams}`);
  const { data, meta } = response;
  return { wards: data, meta };
};

export const createWard = async (wardData: any) => {
  const response = await apiClient(`/wards`, {  // Fixed: removed extra closing brace
    method: "POST",
    body: JSON.stringify(wardData),
  });
  return response;
};

export const updateWard = async (id: string, wardData: any) => {
  const response = await apiClient(`/wards/${id}`, {
    method: "PUT",
    body: JSON.stringify(wardData),
  });
  return response;
};

export const deleteWard = async (id: string) => {
  const response = await apiClient(`/wards/${id}`, {
    method: "DELETE",
  });
  return response;
};

export const fetchWardById = async (id: string) => {
  const response = await apiClient(`/wards/${id}/reference`, {
    method: "GET",
  });
  return response;
};



// Beds
export const fetchBeds = async (filters?: { wardId?: number; status?: string }) => {
  const query = new URLSearchParams();
  if (filters?.wardId) query.append("ward_id", filters.wardId.toString());
  if (filters?.status) query.append("status", filters.status);
  
  const response = await apiClient(`/hospital/beds?${query.toString()}`);
  return response.data;
};


export const createBed = async (bedData: any) => {
  const response = await apiClient("/hospital/beds", {
    method: "POST",
    body: JSON.stringify(bedData),
  });
  return response.data;
};

export const updateBedStatus = async ({ bedId, status }: { bedId: number; status: string }) => {
  const response = await apiClient(`/hospital/beds/${bedId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return response.data;
};

// Patient Bed Assignment
export const assignBedToPatient = async (assignmentData: {
  patientId: number;
  bedId: number;
  admissionId?: number;
  expectedDischargeDate?: string;
  notes?: string;
}) => {
  const response = await apiClient("/hospital/bed-assignments", {
    method: "POST",
    body: JSON.stringify(assignmentData),
  });
  return response.data;
};

export const dischargePatientFromBed = async (assignmentId: number, dischargeData: {
  dischargeReason: string;
  notes?: string;
}) => {
  const response = await apiClient(`/hospital/bed-assignments/${assignmentId}/discharge`, {
    method: "PATCH",
    body: JSON.stringify(dischargeData),
  });
  return response.data;
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
  
  const response = await apiClient(`/hospital/nurse-attendance?${query.toString()}`);
  return response.data;
};

export const createNurseAttendanceLog = async (logData: any) => {
  const response = await apiClient("/hospital/nurse-attendance", {
    method: "POST",
    body: JSON.stringify(logData),
  });
  return response.data;
};

export const fetchPatientsInWard = async (wardId?: number) => {
  const query = wardId ? `?ward_id=${wardId}` : "";
  const response = await apiClient(`/hospital/patients-in-ward${query}`);
  return response.data;
};