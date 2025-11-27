import { apiClient } from "@/lib/api-client";

export interface CreateSubscriptionData {
  planId: string;
  paymentReference: string;
  autoRenew: boolean;
}

export interface UpdateSubscriptionData {
  autoRenew?: boolean;
  planId?: string;
}


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


export const  createSubscription= async(data: CreateSubscriptionData) =>{
    const response = await apiClient('/subscriptions', {
        method:'POST',
        body: JSON.stringify(data)
    });
    return response;
  }

  export const  updateSubscription=async(subscriptionId: string, data: UpdateSubscriptionData) =>{
      const response = await apiClient(`/subscriptions/${subscriptionId}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });
    return response;
  }

  export const  cancelSubscription=async(subscriptionId: string,data) =>{
    const response = await apiClient(`/subscriptions/cancel`, {
        method: "POST",
        body: JSON.stringify(data)
    });
    return response;
  }


  export const  reactivateSubscription=async(subscriptionId: string) =>{
    const response = await apiClient(`/subscriptions/reactivate`, {
        method: "POST",
        // body: JSON.stringify(data)
    });
    return response;
  }
  
  export const  getSubscriptionsHistory=async(page:number, perPage:number) =>{
    const response = await apiClient('/subscriptions/subscription-history');
const { data, meta } = response;
    return { histories: data, meta };
  }