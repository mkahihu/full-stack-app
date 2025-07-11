import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  calculate,
  CalculateArgs,
  clearHistory,
  getHistory,
  HistoryResponse,
} from "./api";
import { queryKeys } from "@/api/queryKeys";

// ✅ Correct: Custom hooks with const/arrow functions
export const useCalculate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: calculate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.calculator.history._def,
      });
    },
  });
};

// ✅ Correct: Mutation for clearing history
export const useClearHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.calculator.history._def,
      });
    },
  });
};

// ✅ Correct: Query hook for fetching data
export const useHistory = (limit = 50, offset = 0) => {
  return useQuery({
    queryKey: [...queryKeys.calculator.history._def, limit, offset],
    queryFn: () => getHistory(limit, offset),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};
