import {
  DOCTOR_SPECIALIZATIONS,
  SPECIALIZATIONS_BY_CATEGORY,
} from "@/constants/medical/specializations";

export type DoctorSpecialization = (typeof DOCTOR_SPECIALIZATIONS)[number];

export type SpecializationCategory = keyof typeof SPECIALIZATIONS_BY_CATEGORY;

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  specialization: DoctorSpecialization;
  licenseNumber: string;
  email: string;
  phoneNumber: string;
  healthcareProviderId: number;
  roleId: number;
  departmentId: number;
  dateOfBirth: string;
  gender: string;
  address: string;
  cityId: number;
  stateId: number;
  countryId: number;
  emergencyContact: number;
  emergencyPhone: string;
  joinDate: string;
  employmentType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorWithDetails extends Staff {
  yearsOfExperience: number;
  education: string[];
  certifications: string[];
  languages: string[];
  bio: string;
}
