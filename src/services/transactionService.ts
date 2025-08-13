/** @format */

import { GET_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import { TransactionResponse, SingleTransactionResponse } from "@/types/transaction.types";
import Cookies from "js-cookie";

export const transactionService = {
  /**
   * Fetch all transactions with pagination
   */
  fetchAllTransactions: async (
    page: number = 1,
    limit: number = 10
  ): Promise<TransactionResponse> => {
    const token = Cookies.get("token");
    const url = `${URLS.BASE}/account/transactions/fetchAll?page=${page}&limit=${limit}`;
    
    const response = await GET_REQUEST<TransactionResponse>(url, token);
    
    if (!response.success) {
      throw new Error(response.error || response.message || "Failed to fetch transactions");
    }
    
    return response as TransactionResponse;
  },

  /**
   * Fetch single transaction by ID
   */
  fetchTransactionById: async (transactionId: string): Promise<SingleTransactionResponse> => {
    const token = Cookies.get("token");
    const url = `${URLS.BASE}/account/transactions/${transactionId}`;
    
    const response = await GET_REQUEST<SingleTransactionResponse>(url, token);
    
    if (!response.success) {
      throw new Error(response.error || response.message || "Failed to fetch transaction");
    }
    
    return response as SingleTransactionResponse;
  },
};
