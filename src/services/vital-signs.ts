import { apiClient } from "@/lib/api-client";

export interface VitalSigns {
  id?: number
  admissionId: number
  recordedBy?: number
  temperature?: number | null
  heartRate?: number | null
  respiratoryRate?: number | null
  bloodPressureSystolic?: number | null
  bloodPressureDiastolic?: number | null
  oxygenSaturation?: number | null
  painLevel?: number | null
  assessmentLevel?: 'routine' | 'urgent' | 'critical'
  notes?: string | null
  isManualEntry?: boolean
  recordedAt?: string
  overallStatus?: 'normal' | 'warning' | 'critical'
  isAbnormal?: boolean
  recordedByUser?: {
    id: number
    fullName: string
    email: string
    avatar?: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface VitalSignsInput {
  admissionId: number
  temperature?: number | null
  heartRate?: number | null
  respiratoryRate?: number | null
  bloodPressureSystolic?: number | null
  bloodPressureDiastolic?: number | null
  oxygenSaturation?: number | null
  painLevel?: number | null
  assessmentLevel?: 'routine' | 'urgent' | 'critical'
  notes?: string | null
  isManualEntry?: boolean
  recordedAt?: string
}

export interface VitalTrends {
  temperature: {
    current: number
    trend: 'up' | 'down' | 'stable'
    change: number
    stats: {
      average: number
      min: number
      max: number
      variability: number
    }
  }
  heartRate: {
    current: number
    trend: 'up' | 'down' | 'stable'
    change: number
    stats: {
      average: number
      min: number
      max: number
      variability: number
    }
  }
  bloodPressure: {
    systolic: {
      current: number
      average: number
    }
    diastolic: {
      current: number
      average: number
    }
    trend: 'up' | 'down' | 'stable'
    change: number
  }
  oxygenSaturation: {
    current: number
    trend: 'up' | 'down' | 'stable'
    change: number
    stats: {
      average: number
      min: number
      max: number
      variability: number
    }
  }
  respiratoryRate: {
    current: number
    trend: 'up' | 'down' | 'stable'
    change: number
    stats: {
      average: number
      min: number
      max: number
      variability: number
    }
  }
  history: VitalSigns[]
}

export interface VitalStats {
  total: number
  abnormal: number
  critical: number
  today: number
  latest: {
    temperature: number | null
    heartRate: number | null
    bloodPressure: string | null
    oxygenSaturation: number | null
    respiratoryRate: number | null
    painLevel: number | null
    overallStatus: 'normal' | 'warning' | 'critical'
    recordedAt: string
  } | null
}

/**
 * Record new vital signs
 */
export const recordVitalSigns = async (data: VitalSignsInput): Promise<VitalSigns> => {
  const response = await apiClient('/vitals', {body: JSON.stringify(data), method:'POST'})
  return response
}

/**
 * Get vital signs history for an admission
 */
export const getVitalSignsHistory = async (
  admissionId: number, 
  options?: {
    timeRange?: '24h' | '7d' | '30d' | 'all'
    page?: number
    limit?: number
  }
) => {
  const params = new URLSearchParams()
  if (options?.timeRange) params.append('timeRange', options.timeRange)
  if (options?.page) params.append('page', options.page.toString())
  if (options?.limit) params.append('limit', options.limit.toString())
  
  const response = await apiClient(`/vitals/admissions/${admissionId}/vitals?${params}`)
      const { data, meta } = response;
  return { vitals: data, meta };
}

/**
 * Get latest vital signs for an admission
 */
export const getLatestVitals = async (admissionId: number): Promise<VitalSigns | null> => {
  const response = await apiClient(`/vitals/admissions/${admissionId}/vitals/latest`)
  return response
}

/**
 * Get abnormal vital signs for an admission
 */
export const getAbnormalVitals = async (
  admissionId: number, 
  options?: { page?: number; limit?: number }
) => {
  const params = new URLSearchParams()
  if (options?.page) params.append('page', options.page.toString())
  if (options?.limit) params.append('limit', options.limit.toString())
  
  const response = await apiClient(`/vitals/admissions/${admissionId}/vitals/abnormal?${params}`)
const { data, meta } = response;
    return { vitals: data, meta };
}

/**
 * Get vital trends for an admission
 */
export const getVitalTrends = async (
  admissionId: number, 
  timeRange: '24h' | '7d' | '30d' = '7d'
): Promise<VitalTrends> => {
  const response = await apiClient(`/vitals/admissions/${admissionId}/vitals/trends?timeRange=${timeRange}`)
  return response
}

/**
 * Get vital statistics for an admission
 */
export const getVitalStats = async (admissionId: number): Promise<VitalStats> => {
  const response = await apiClient(`/vitals/admissions/${admissionId}/vitals/stats`)
  return response
}

/**
 * Update vital signs
 */
export const updateVitalSigns = async (id: number, data: Partial<VitalSignsInput>): Promise<VitalSigns> => {
  const response = await apiClient(`/vitals/${id}`, {body:JSON.stringify(data), method:'PUT'})
  return response
}

/**
 * Delete vital signs
 */
export const deleteVitalSigns = async (id: number): Promise<void> => {
   const response= await apiClient(`/vitals/${id}`, { method: 'DELETE' })
      return response

}

/**
 * Export vital signs to CSV
 */
// export const exportVitalSigns = async (admissionId: number): Promise<Blob> => {
//   const response = await apiClient(`/vitals/admissions/${admissionId}/vitals/export`, {
//       responseType: 'blob'
//   })
//   return response
// }

/**
 * Batch record vital signs
 */
export const batchRecordVitalSigns = async (vitalSigns: VitalSignsInput[]): Promise<VitalSigns[]> => {
  const response = await apiClient('/vitals/vitals/batch', { body:JSON.stringify(vitalSigns), method:'POST' })
  return response
}