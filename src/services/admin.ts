import { apiClient } from "@/lib/api-client";
// Types
interface HealthcareProvider {
  id: number;
  name: string;
  country: string;
  email: string;
  phone: string;
  status: string;
  users: number;
  joinedDate: string;
  address: string;
  type: string;
  plan: string;
}

interface ProvidersResponse {
  data: HealthcareProvider[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
  };
}

// API service function
export const fetchHealthcareProviders = async (params: {
  page: number;
  perPage: number;
  search: string;
  status: string;
}): Promise<any> => {
  const searchParams = new URLSearchParams();
  searchParams.append('page', params.page.toString());
  searchParams.append('perPage', params.perPage.toString());
  if (params.search) searchParams.append('search', params.search);
  if (params.status && params.status !== 'all') searchParams.append('status', params.status);

  const response = await apiClient(`/admins/healthcares?${searchParams}`);
  
  if (!response) {
    throw new Error('Failed to fetch healthcare providers');
  }
  
const { data, meta } = response;

    return {
      providers: data,
      meta: meta,
    };
};


export const activateProviderAccount = async (providerId: string) => {
  const response = await apiClient(`/admins/healthcares/${providerId}/activate`, {
    method: 'PATCH',
  });
  
  if (!response) {
    throw new Error('Failed to activate account');
  }
  
  return response
};

export const assignSubscriptionPlan = async (payload: {
  providerId: number; planId: string,
  billingCycle: 'monthly' | 'quarterly'
  |'half_yearly'| 'yearly'| 'custom'
}) => {
  // Replace with your actual API call
  const response = await apiClient(`/admins/healthcares/subscription/upgrade`, {
    method: 'POST',
    body: JSON.stringify({ planId: payload.planId, hospitalId: payload.providerId, billingCycle:payload.billingCycle  }),
  });
  
  if (!response) {
    throw new Error('Failed to assign subscription plan');
  }
  
  return response
};