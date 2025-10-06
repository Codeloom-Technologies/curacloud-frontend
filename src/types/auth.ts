export interface LoginApiPayload {
  email: string;
  password: string;
}


export interface Role {
  id: number;
  name: string;
  slug: string;
}