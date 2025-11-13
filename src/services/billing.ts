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
