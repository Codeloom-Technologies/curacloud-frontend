export interface LoginApiPayload {
  email: string;
  password: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
}

export type RoleSlug =
  | "super_admin"
  | "admin"
  | "support"
  | "health_care"
  | "hr_manager"
  | "finance_accounts"
  | "it_support"
  | "inventory_manager"
  | "doctor"
  | "nurse"
  | "pharmacist"
  | "lab_technician"
  | "radiologist"
  | "receptionist"
  | "cashier"
  | "attendant"
  | "patient"
  | "guardian";

export interface Country {
  id: number;
  name: string;
  currency: string;
  phoneCode: string;
  capitalCity: string;
}

export interface User {
  reference: string;
  email: string;
  healthcareProviderId: number;
  status: string;
  isActive: boolean;
  roles: Role[];
  country: Country;
}

export interface AccessToken {
  type: string;
  name: string;
  value: string;
  identifier: number;
}

export interface LoginResponse {
  message: string;
  status: string;
  data: {
    user: User;
    accessToken: AccessToken;
  };
}