export interface OnboardingFormData {
  role: string;
  facilityName: string;
  facilityType: string;
  facilitySize: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  position: string;
}

export interface OnboardingApiPayload {
  facilityName: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  roleId: number;
  countryId: number;
  stateId: number;
  cityId: number;
  role: string;
  facilitySize: string;
  facilityType: string;
  position: string;
  address: {
    postalCode: string;
    streetAddress: string;
  };
}
