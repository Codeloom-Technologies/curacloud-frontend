import { apiClient } from "@/lib/api-client";

export const getBalance = async (): Promise< any> => {
  try {
    const response = await apiClient("/wallets");

    if (!response) {
      throw new Error("Failed to fetch wallets");
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const getTransactionHistory = async (page:number =1,perPage:number=10): Promise< any> => {
  try {
    const response = await apiClient(`/wallets/transactions?page=${page}&perPage=${perPage}`);

    if (!response) {
      throw new Error("Failed to fetch wallets");
    }

        const { data, meta } = response;

    return {transactions:data, meta};
  } catch (error) {
    throw error;
  }
};


export const getStats = async (): Promise<any> => {
    try {
        const response = await apiClient(`/wallets/stats`);

        if (!response) {
            throw new Error("Failed to fetch stats");
        }
     return response
    } catch (error) {
    throw error;
    }
    
}