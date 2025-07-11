import apiClient from "@/api/apiClient";
import { components, paths } from "@/api/generated/generated-api";

//#region Paths
const calculatePath = "/api/calculator/calculate";
const historyPath = "/api/calculator/history";
//#endregion

//#region Args
export type CalculateArgs =
  paths[typeof calculatePath]["post"]["requestBody"]["content"]["application/json"];
//#endregion

//#region components
export type CalculationResponse = components["schemas"]["CalculationResponse"];
export type HistoryResponse = components["schemas"]["HistoryResponse"];
//#endregion

//#region API
export async function calculate(
  args: CalculateArgs
): Promise<CalculationResponse> {
  const response = await apiClient.post<CalculationResponse>(
    calculatePath,
    args
  );
  return response.data;
}

export async function getHistory(
  limit = 50,
  offset = 0
): Promise<HistoryResponse> {
  const response = await apiClient.get<HistoryResponse>(historyPath, {
    params: { limit, offset },
  });
  return response.data;
}

export async function clearHistory(): Promise<void> {
  await apiClient.delete(historyPath);
}
//#endregion
