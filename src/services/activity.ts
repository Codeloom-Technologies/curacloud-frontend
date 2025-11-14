import { apiClient } from "@/lib/api-client";

export interface Activity {
  id: number;
  healthcareProviderId: number;
  userId: number;
  title: string;
  content: string;
  type: string;
  action?: string;
  resourceType?: string;
  resourceId?: number;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    fullName?: string;
  };
}

export interface ActivityFilters {
  type?: string;
  status?: string;
  action?: string;
  resourceType?: string;
  resourceId?: number;
  startDate?: string;
  endDate?: string;
  userId?: number;
}

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface ActivitiesResponse {
  data: Activity[];
  meta: PaginationMeta;
}

export interface ActivityStats {
  total: number;
  today: number;
  weekly: number;
  monthly: number;
  byType: Array<{
    type: string;
    count: number;
  }>;
  byUser: Array<{
    userId: number;
    userName: string;
    count: number;
  }>;
}

export const getActivities = async (
  page: number = 1,
  perPage: number = 3,
  search: string = "",
  filters: ActivityFilters = {}
): Promise<ActivitiesResponse | any> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
    });

    // Add search only if it's not empty
    if (search && search.trim() !== "") {
      queryParams.append("search", search.trim());
    }

    // Add filters dynamically (only non-empty values)
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== "" &&
        value !== null &&
        value !== false
      ) {
        queryParams.append(key, String(value));
      }
    });

    const response = await apiClient(`/activities?${queryParams}`);

    if (!response) {
      throw new Error("Failed to fetch activities");
    }

    const { data, meta } = response;

    return {
      activities: data,
      meta: meta,
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
};

export const getRecentActivities = async (
  perPage: number = 10
): Promise<Activity[] | any> => {
  try {
    const response = await apiClient(`/activities?perPage=${perPage}&page=1`);

    if (!response) {
      throw new Error("Failed to fetch recent activities");
    }

    const { data, meta } = response;

    return {
      activities: data,
      meta: meta,
    };
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    throw error;
  }
};

export const getActivityStats = async (): Promise<ActivityStats | any> => {
  try {
    const response = await apiClient("/activities/stats");

    if (!response) {
      throw new Error("Failed to fetch activity stats");
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const searchActivities = async (
  query: string,
  page: number = 1,
  perPage: number = 20
): Promise<ActivitiesResponse | any> => {
  try {
    const response = await apiClient(
      `/activities/search?query=${encodeURIComponent(
        query
      )}&page=${page}&perPage=${perPage}`
    );

    if (!response) {
      throw new Error("Failed to search activities");
    }

    const { data, meta } = response;
    return {
      activities: data,
      meta: meta,
    };
  } catch (error) {
    console.error("Error searching activities:", error);
    throw error;
  }
};

export const getActivitiesByType = async (
  type: string,
  page: number = 1,
  perPage: number = 20
): Promise<ActivitiesResponse | any> => {
  try {
    const response = await apiClient(
      `/activities/type/${type}?page=${page}&perPage=${perPage}`
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch activities by type" }));
      throw new Error(
        errorData.message || "Failed to fetch activities by type"
      );
    }

    const data = await response.json();

    // Ensure the response has the expected structure
    if (!data.data || !data.meta) {
      throw new Error("Invalid response format from activities by type API");
    }

    return {
      activities: data.data,
      meta: data.meta,
    };
  } catch (error) {
    console.error("Error fetching activities by type:", error);
    throw error;
  }
};

export const getResourceActivities = async (
  resourceType: string,
  resourceId: number
): Promise<Activity[]> => {
  try {
    const response = await apiClient(
      `/activities/resource/${resourceType}/${resourceId}`
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch resource activities" }));
      throw new Error(
        errorData.message || "Failed to fetch resource activities"
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching resource activities:", error);
    throw error;
  }
};

// Helper function to create activity (for use in other services)
export const createActivity = async (activityData: {
  title: string;
  content: string;
  type: string;
  action?: string;
  resourceType?: string;
  resourceId?: number;
  metadata?: any;
}): Promise<Activity> => {
  try {
    const response = await apiClient("/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create activity" }));
      throw new Error(errorData.message || "Failed to create activity");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error creating activity:", error);
    throw error;
  }
};
