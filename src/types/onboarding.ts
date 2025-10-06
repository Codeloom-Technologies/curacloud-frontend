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
  countryId: string;
  stateId: string;
  cityId: string;
  fullName: string;
  email: string;
  phone: string;
  phoneCode: string;
  password: string;
  position: string;
  gender: string;
}

export interface OnboardingApiPayload {
  facilityName: string;
  fullName: string;
  email: string;
  gender: string;
  password: string;
  phoneNumber: string;
  phoneCode: string;
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
