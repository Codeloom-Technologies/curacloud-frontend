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
