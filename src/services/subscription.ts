import { apiClient } from "@/lib/api-client";

export const getSubscriptionPlans = async (): Promise< any> => {
  try {
    const response = await apiClient("/subscriptions/plans");

    if (!response) {
      throw new Error("Failed to fetch subscription");
    }

    return response;
  } catch (error) {
    throw error;
  }
};


export const getActiveSubscriptionPlan = async (): Promise< any> => {
  try {
    const response = await apiClient("/subscriptions/current");

    if (!response) {
      throw new Error("Failed to fetch subscriptions");
    }

    return response;
  } catch (error) {
    throw error;
  }
};