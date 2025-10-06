export const HEALTHCARE_PROVIDER_TYPES = [
  "Hospital",
  "Clinic",
  "Medical Center",
  "Specialty Center",
  "Diagnostic Center",
  "Surgical Center",
  "Pharmacy",
  "Other",
] as const;

export const APPOINTMENT_STATUS = [
  "Scheduled",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
  "No Show",
] as const;

export const PATIENT_STATUS = [
  "Active",
  "Inactive",
  "Transferred",
  "Deceased",
] as const;

export const HEALTHCARE_PROVIDER_ROLES = [
  {
    title: "Healthcare Provider",
    description: "Doctor, Physician, Specialist",
  },
  {
    title: "Nursing Staff",
    description: "Nurse, Care Coordinator",
  },
  {
    title: "Hospital Administrator",
    description: "Manager, Operations, Executive",
  },
  {
    title: "Other Healthcare Professional",
    description: "Pharmacist, Lab Technician, etc.",
  },
] as const;

export const HEALTHCARE_PROVIDER_FACILITY_SIZE = [
  "Small (1-50 staffs)",
  "Medium (51-200 staffs)",
  "Large (201-500 staffs)",
  "Enterprise (500+ staffs)",
] as const;
