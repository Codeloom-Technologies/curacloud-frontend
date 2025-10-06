import type { DoctorSpecialization } from "./medical";

export interface CreateStaffRequest {
  title: string;
  firstName: string;
  lastName: string;
  specialization: DoctorSpecialization;
  licenseNumber: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  departmentId: number;
  dob: string;
  gender: string;
  address: object;
  cityId: number | string;
  stateId: number;
  countryId: number;
  emergencyContactName: string;
  emergencyPhoneNumber: string;
  joinDate: string;
  employmentType: string;
}

export interface UpdateDoctorRequest {
  firstName?: string;
  lastName?: string;
  specialization?: DoctorSpecialization;
  licenseNumber?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}
