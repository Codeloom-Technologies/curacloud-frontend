import { apiClient } from "@/lib/api-client";

// Types
export interface Medication {
  id?: number;
  admissionId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  prescriber: any;
  administrator?: any;
  administeredAt?: string;
  status: 'prescribed' | 'administered' | 'cancelled' | 'completed';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicationHistory {
  id: number;
  medicationId: number;
  action: 'prescribed' | 'administered' | 'adjusted' | 'cancelled';
  performer: any;
  notes?: string;
  createdAt: string;
  user?: {
    id: number;
    fullName: string;
    role: string;
  };
}

  // Get medications for an admission
  export const getAdmissionMedications= async (admissionId: string | number) => {
    const response = await apiClient(`/medications/${admissionId}/medications`);
    return response;
  }

  // Prescribe new medication
  export const prescribeMedication= async (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiClient('/medications', {body: JSON.stringify(medication), method:'POST'});
    return response;
  }

  // Administer medication
 export const administerMedication= async (medicationId: number, data: { administeredBy: number; notes?: string }) => {
    const response = await apiClient(`/medications/${medicationId}/administer`, {body:JSON.stringify({data}), method:'POST'});
    return response;
  }

  // Update medication
  export const updateMedication= async (medicationId: number, data: Partial<Medication>) => {
    const response = await apiClient(`/medications/${medicationId}`, {body:JSON.stringify(data), method:'PUT'});
    return response;
  }

  // Cancel medication
  export const cancelMedication=  async (medicationId: number, reason: string) => {
    const response = await apiClient(`/medications/${medicationId}/cancel`, {body: JSON.stringify({reason}) , method:'POST'});
    return response;
  }

  // Get medication history
  export const getMedicationHistory= async (medicationId: number) => {
    const response = await apiClient(`/medications/${medicationId}/history`);
    return response;
  }

  // Get active medications
  export const getActiveMedications= async (admissionId: string | number) => {
    const response = await apiClient(`/medications/${admissionId}/active`);
    return response;
  }

  // Get due medications
 export const getDueMedications= async (admissionId: string | number) => {
    const response = await apiClient(`/medications/${admissionId}/due`);
    return response;
  }

 export const getMedicationStats= async (admissionId: string | number) => {
    const response = await apiClient(`/medications/${admissionId}/stats`);
    return response;
  }

  