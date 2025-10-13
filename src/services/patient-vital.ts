import { apiClient } from "@/lib/api-client";

export const createPatientVital = async (payload: any) => {
  const response = await apiClient("/patient-vitals", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create vital ");
  }
  return response;
};

export const fetchPatientVital = async (
  page: number = 1,
  perPage: number = 5,
  search: string = "",
  filters: Record<string, any> = {}
): Promise<any | any> => {
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

  const response = await apiClient(`/patient-vitals?${queryParams}`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch vitals");
  }
  const { data, meta } = response;
  return { vitals: data, meta };
};

export const updatePatientVital = async (id: number, payload: any) => {
  const response = await apiClient(`/patient-vitals/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create vital ");
  }
  return response;
};

// export const fetchAppointmentCalender = async (): Promise<any | any> => {
//   const response = await apiClient(`/appointments/calendar`);

//   if (!response) {
//     const error = await response;
//     throw new Error(error.message || "Failed to fetch appointments calendar");
//   }

//   return response;
// };

// export const fetchAppointmentStats = async (): Promise<any | any> => {
//   const response = await apiClient(`/appointments/stats`);

//   if (!response) {
//     const error = await response;
//     throw new Error(error.message || "Failed to fetch appointments stats");
//   }

//   return response;
// };

// export const updateAppointmentStatus = async (id: number, payload: any) => {
//   console.log(payload);
//   const response = await apiClient(`/appointments/${id}/status`, {
//     method: "PATCH",
//     body: JSON.stringify(payload),
//   });

//   if (!response) {
//     const error = await response;
//     throw new Error(error.message || "Failed to uodate appointments ");
//   }
//   return response;
// };

// export const fetchAppointmentsInQueue = async (
//   page: number = 1,
//   perPage: number = 5,
//   search: string = "",
//   filters: Record<string, any> = {}
// ): Promise<any | any> => {
//   const queryParams = new URLSearchParams({
//     page: page.toString(),
//     perPage: perPage.toString(),
//   });

//   // Add search only if it's not empty
//   if (search && search.trim() !== "") {
//     queryParams.append("search", search.trim());
//   }

//   // Add filters dynamically (only non-empty values)
//   Object.entries(filters).forEach(([key, value]) => {
//     if (value !== undefined && value !== "" && value !== false) {
//       queryParams.append(key, String(value));
//     }
//   });

//   const response = await apiClient(`/appointments/in-queue?${queryParams}`);

//   if (!response) {
//     const error = await response;
//     throw new Error(error.message || "Failed to fetch appointments");
//   }
//   const { data, meta } = response;
//   return { appointments: data, meta };
// };
