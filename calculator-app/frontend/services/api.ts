/**
 * API service for calculator backend communication
 */
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface CalculationResponse {
  id: number;
  expression: string;
  result: number;
  created_at: string;
}

export interface HistoryResponse {
  calculations: CalculationResponse[];
  total: number;
}

export const calculatorApi = {
  /**
   * Calculate mathematical expression
   */
  calculate: async (expression: string): Promise<CalculationResponse> => {
    const response = await api.post("/api/calculator/calculate", {
      expression,
    });
    return response.data;
  },

  /**
   * Get calculation history
   */
  getHistory: async (limit = 50, offset = 0): Promise<HistoryResponse> => {
    const response = await api.get("/api/calculator/history", {
      params: { limit, offset },
    });
    return response.data;
  },

  /**
   * Clear calculation history
   */
  clearHistory: async (): Promise<void> => {
    await api.delete("/api/calculator/history");
  },
};
