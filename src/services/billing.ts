import { apiClient } from "@/lib/api-client";

export const createInvoice = async (payload: {
  patientId: string;
  amount: number;
  dueDate: string | Date;
  notes: string;
  service: string;
}) => {
  const response = await apiClient(`/invoices`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to create billings ");
  }
  return response;
};

export const fetchAllBillings = async (
  page: number = 1,
  perPage: number = 10,
  search: string = "",
  statusFilter: string
): Promise<any | any> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
    ...(search && { search }),
    ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
  });
  const response = await apiClient(`/invoices?${queryParams}`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch billings");
  }
  const { data, meta } = response;

  return { invoices: data, meta };
};

export const getInvoiceStats = async () => {
  const response = await apiClient("/invoices/stats");
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch billings ");
  }
  return response;
};

export const markInvoiceAsPaid = async (
  id: number,
  payload: {
    paymentMethod: string;
    paymentReference: number;
  }
) => {
  const response = await apiClient(`/invoices/${id}/mark-paid`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to update billings ");
  }

  return response;
};

export const getInvoiceByInvoiceId = async (id: string) => {
  const response = await apiClient(`/invoices/invoice/${id}`, {
    method: "GET",
  });

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to update billings ");
  }

  return response;
};

export const fetchRecentBillings = async (): Promise<any | any> => {
  const response = await apiClient(`/invoices/recent/invoices`);

  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch billings");
  }

  return response;
};
// await new Promise((r) => setTimeout(r, 6000)); // ⏳ simulate  delay in s

export const getStatsForMonth = async () => {
  const response = await apiClient("/invoices/stats/monthly");
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch billings ");
  }
  return response;
};

// services/billing.ts
export const getRevenueData = async (): Promise<any[]> => {
  const response = await apiClient("/invoices/monthly/revenue-data");
  if (!response) {
    const error = await response;
    throw new Error(error.message || "Failed to fetch billings ");
  }
  return response;
};

export const getPaymentMethodData = async (): Promise<any[]> => {
  const response = await apiClient("/invoices/billing/payment-methods");
  if (!response) {
    const error = await response;
    console.log({ error });
    throw new Error(error.message || "Failed to fetch billings ");
  }
  return response;
};

export const getDepartmentRevenueData = async (): Promise<any[]> => {
  const response = await apiClient("/invoices/billing/department-revenue");
  return response;
};

export const getReports = async (): Promise<any[]> => {
  const response = await apiClient("/invoices/billing/reports");
  return response;
};
