import { RoleSlug } from "@/types/auth";

export type Permission =
  | "dashboard"
  | "patients"
  | "patients.register"
  | "patients.records"
  | "appointments"
  | "appointments.calendar"
  | "appointments.checkin"
  | "patient-vitals"
  | "patient-vitals.appointments"
  | "medical-records"
  | "consultations"
  | "prescriptions"
  | "medical-history"
  | "laboratory"
  | "laboratory.orders"
  | "laboratory.results"
  | "laboratory.reports"
  | "radiology"
  | "pharmacy"
  | "pharmacy.inventory"
  | "pharmacy.prescriptions"
  | "pharmacy.dispensing"
  | "pharmacy.stock"
  | "inventory"
  | "billing"
  | "billing.invoices"
  | "billing.payments"
  | "billing.reports"
  | "staff"
  | "staff.register"
  | "staff.records"
  | "reports"
  | "settings"
  | "billing.subscription";

// ACL Configuration: Maps roles to their allowed permissions
export const rolePermissions: Record<RoleSlug, Permission[]> = {
  // Super Admin - Full access
  super_admin: [
    "dashboard",
    "patients",
    "patients.register",
    "patients.records",
    "appointments",
    "appointments.calendar",
    "appointments.checkin",
    "patient-vitals",
    "patient-vitals.appointments",
    "medical-records",
    "consultations",
    "prescriptions",
    "medical-history",
    "laboratory",
    "laboratory.orders",
    "laboratory.results",
    "laboratory.reports",
    "radiology",
    "pharmacy",
    "pharmacy.inventory",
    "pharmacy.prescriptions",
    "pharmacy.dispensing",
    "pharmacy.stock",
    "inventory",
    "billing",
    "billing.invoices",
    "billing.payments",
    "billing.reports",
    "staff",
    "staff.register",
    "staff.records",
    "reports",
    "settings",
  ],

  // Admin - Most access except some sensitive features
  admin: [
    "dashboard",
    "patients",
    "patients.register",
    "patients.records",
    "appointments",
    "appointments.calendar",
    "appointments.checkin",
    "patient-vitals",
    "patient-vitals.appointments",
    "medical-records",
    "consultations",
    "prescriptions",
    "medical-history",
    "laboratory",
    "laboratory.orders",
    "laboratory.results",
    "laboratory.reports",
    "billing",
    "billing.invoices",
    "billing.payments",
    "billing.reports",
    "staff",
    "staff.register",
    "staff.records",
    "reports",
    "settings",
  ],

  // Support - View access mainly
  support: [
    "dashboard",
    "patients",
    "patients.records",
    "appointments",
    "appointments.calendar",
    "medical-records",
    "consultations",
    "prescriptions",
    "medical-history",
    "settings",
  ],

  // Healthcare Provider - Full clinical access
  health_care: [
    "dashboard",
    "patients",
    "patients.register",
    "patients.records",
    "appointments",
    "appointments.calendar",
    "appointments.checkin",
    "patient-vitals",
    "patient-vitals.appointments",
    "medical-records",
    "consultations",
    "prescriptions",
    "medical-history",
    "laboratory",
    "laboratory.orders",
    "laboratory.results",
    "laboratory.reports",
    "radiology",
    "pharmacy",
    "pharmacy.inventory",
    "pharmacy.prescriptions",
    "pharmacy.dispensing",
    "pharmacy.stock",
    "settings",
    "staff",
    "staff.register",
    "staff.records",
    "billing",
    "billing.invoices",
    "billing.payments",
    "billing.reports",
    "reports",
    "billing.subscription",
  ],

  // HR Manager - Staff and HR management
  hr_manager: [
    "dashboard",
    "staff",
    "staff.register",
    "staff.records",
    "reports",
    "settings",
  ],

  // Finance/Accounts - Billing and financial operations
  finance_accounts: [
    "dashboard",
    "patients",
    "patients.records",
    "billing",
    "billing.invoices",
    "billing.payments",
    "billing.reports",
    "reports",
    "settings",
  ],

  // IT Support - Technical and system settings
  it_support: ["dashboard", "staff", "staff.records", "reports", "settings"],

  // Inventory Manager - Inventory and supplies
  inventory_manager: [
    "dashboard",
    "inventory",
    "pharmacy",
    "pharmacy.inventory",
    "pharmacy.stock",
    "laboratory",
    "laboratory.orders",
    "reports",
    "settings",
  ],

  // Doctor - Clinical patient care
  doctor: [
    "dashboard",
    "patients",
    "patients.register",
    "patients.records",
    "appointments",
    "appointments.calendar",
    "appointments.checkin",
    // "patient-vitals",
    // "patient-vitals.appointments",
    "medical-records",
    "consultations",
    "prescriptions",
    "medical-history",
    "laboratory",
    "laboratory.orders",
    "laboratory.reports",
    "radiology",
    "settings",
  ],

  // Nurse - Patient care and vitals
  nurse: [
    "dashboard",
    "patients",
    "patients.register",
    "patients.records",
    "appointments",
    "appointments.checkin",
    "patient-vitals",
    "patient-vitals.appointments",
    "medical-records",
    "consultations",
    "prescriptions",
    "medical-history",
    "laboratory",
    "laboratory.reports",
    "settings",
  ],

  // Pharmacist - Medication and prescriptions
  pharmacist: [
    "dashboard",
    "patients",
    "patients.records",
    "prescriptions",
    "pharmacy",
    "pharmacy.inventory",
    "pharmacy.prescriptions",
    "pharmacy.dispensing",
    "pharmacy.stock",
    "inventory",
    "settings",
  ],

  // Lab Technician - Laboratory operations
  lab_technician: [
    "dashboard",
    "patients",
    "patients.records",
    "laboratory",
    "laboratory.orders",
    "laboratory.results",
    "laboratory.reports",
    "settings",
  ],

  // Radiologist - Radiology imaging
  radiologist: [
    "dashboard",
    "patients",
    "patients.records",
    "appointments",
    "radiology",
    "settings",
  ],

  // Receptionist - Front desk operations
  receptionist: [
    "dashboard",
    "patients",
    "patients.register",
    "patients.records",
    "appointments",
    "appointments.calendar",
    "appointments.checkin",
    "settings",
  ],

  // Cashier - Payment processing
  cashier: [
    "dashboard",
    "patients",
    "patients.records",
    "billing",
    "billing.invoices",
    "billing.payments",
    "settings",
  ],

  // Attendant - Basic patient assistance
  attendant: [
    "dashboard",
    "patients",
    "patients.records",
    "patient-vitals",
    "patient-vitals.appointments",
    "settings",
  ],

  // Patient - Limited self-service access
  patient: ["dashboard", "settings"],

  // Guardian - Dependent management
  guardian: ["dashboard", "settings"],
};

// Navigation items mapped to permissions
export const navigationPermissions: Record<string, Permission> = {
  "/dashboard": "dashboard",
  "/dashboard/patients": "patients",
  "/dashboard/patients/register": "patients.register",
  "/dashboard/patients/records": "patients.records",
  "/dashboard/appointments": "appointments",
  "/dashboard/appointments/calendar": "appointments.calendar",
  "/dashboard/appointments/checkin": "appointments.checkin",
  "/dashboard/appointment-check-ins": "patient-vitals.appointments",
  "/dashboard/patient-vitals": "patient-vitals",
  "/dashboard/consultations": "consultations",
  "/dashboard/prescriptions": "prescriptions",
  "/dashboard/medical-history": "medical-history",
  "/dashboard/lab/orders": "laboratory.orders",
  "/dashboard/lab/results": "laboratory.results",
  "/dashboard/lab/reports": "laboratory.reports",
  "/dashboard/billing": "billing",
  "/dashboard/billing/invoices": "billing.invoices",
  "/dashboard/billing/payments": "billing.payments",
  "/dashboard/billing/reports": "billing.reports",
  "/dashboard/staff": "staff",
  "/dashboard/staff/register": "staff.register",
  "/dashboard/staff/records": "staff.records",
  "/dashboard/pharmacy/inventory": "pharmacy.inventory",
  "/dashboard/pharmacy/prescriptions": "pharmacy.prescriptions",
  "/dashboard/pharmacy/dispensing": "pharmacy.dispensing",
  "/dashboard/pharmacy/stock": "pharmacy.stock",
  "/dashboard/settings": "settings",
};
