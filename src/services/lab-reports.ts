import { apiClient } from "@/lib/api-client";
import { apiUploadClient } from "@/lib/api-upload-client";

export interface CreateLabReportData {
  labOrderId: number
  uploadMethod: 'file' | 'manual' | 'interface'
  results: LabResult[]
  criticalValues?: CriticalValue[]
  clinicalNotes?: string
  interpretation?: string
  attachments?: string[]
  technicianId?: number
  reportDate: string
  testingDate: string
}

export interface LabResult {
  parameter: string
  value: string | number
  unit: string
  referenceRange: string
  flag: 'normal' | 'low' | 'high' | 'critical'
  methodology?: string
  note?: string
}

export interface CriticalValue {
  parameter: string
  value: string | number
  unit: string
  referenceRange: string
  notifiedAt?: string
  acknowledgedBy?: number
}

// Create lab report
export const createLabReport = async (data: CreateLabReportData) => {
  const response = await apiClient('/lab-reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
      if (!response) {
          const error = await response;
          console.log({error})
    throw new Error(error.message || "Failed to create lab report");
  }
  return response
}

export const createLabReportWithFiles = async (formData: FormData) => {
    const response = await apiUploadClient('/lab-reports/with-files', {
        body: formData,
        method: 'POST'
  })
  return response
}


// Get lab reports by order ID
export const getLabReportsByOrder = async (orderId: string) => {
  const response = await apiClient(`/lab-reports/order/${orderId}`)
  return response
}

// Get lab report by ID
export const getLabReport = async (reportId: string) => {
  const response = await apiClient(`/lab-reports/${reportId}`)
  return response
}

// Update lab report status
export const updateLabReportStatus = async (reportId: string, status: string, notes?: string | any) => {
    const response = await apiClient(`/lab-reports/${reportId}/status`, { 
    method: 'PUT',
    body: JSON.stringify(status,  notes)
  })
  return response
}

// Verify lab report
export const verifyLabReport = async (reportId: string) => {
  const response = await apiClient(`/lab-reports/${reportId}/verify`)
  return response
}